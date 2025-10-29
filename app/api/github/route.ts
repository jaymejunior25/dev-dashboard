import { NextResponse } from 'next/server';

// Colocamos o username aqui para fácil manutenção
const GITHUB_USERNAME = 'jaymejunior25';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'Token do GitHub não configurado' },
      { status: 500 }
    );
  }

  try {
    // Query única para buscar tudo (avatar, nome, repos fixados)
    const query = {
      query: `
        query {
          user(login: "${GITHUB_USERNAME}") {
            avatarUrl
            name
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  id
                  name
                  description
                  url
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      `,
    };

    const resPinned = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
      next: {
        revalidate: 3600, // Cache de 1 hora
      },
    });

    if (!resPinned.ok) throw new Error('Erro ao buscar dados do GitHub (GraphQL)');
    const pinnedData = await resPinned.json();
    if (pinnedData.errors) throw new Error(pinnedData.errors[0].message);

    const userData = pinnedData.data.user;

    // 2. Buscar as estatísticas de linguagem (API REST)
    const resRepos = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 3600, // Cache de 1 hora
        },
      }
    );

    if (!resRepos.ok) throw new Error('Erro ao buscar lista de repositórios (REST)');
    const repos = await resRepos.json();
    
    // Processar linguagens
    const langStats: { [key: string]: { count: number; color?: string } } = {};
    for (const repo of repos) {
      if (repo.language) {
        const lang = repo.language;
        if (!langStats[lang]) {
          langStats[lang] = { count: 0, color: (repo as any).primaryLanguage?.color };
        }
        langStats[lang].count++;
      }
    }

    // Retornar os dados combinados
    return NextResponse.json({
      avatarUrl: userData.avatarUrl,
      name: userData.name,
      pinnedRepos: userData.pinnedItems.nodes,
      langStats,
    });

  } catch (error) {
    console.error('ERRO GERAL NA API /api/github:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
