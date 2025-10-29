// src/app/api/github/route.ts
import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'jaymejunior25';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  console.log('--- CHAMANDO A API /api/github ---');
  console.log('O TOKEN FOI LIDO?', !!token);

  if (!token) {
    return NextResponse.json(
      { error: 'Token do GitHub não configurado' },
      { status: 500 }
    );
  }

  try {
    // 1. Buscar os repositórios fixados (pinned)
    const pinnedQuery = {
      query: `
        query {
          user(login: "${GITHUB_USERNAME}") {
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
      body: JSON.stringify(pinnedQuery),
      next: {
        revalidate: 3600, // Cache
      },
    });

    const pinnedData = await resPinned.json();

    // --- MELHOR DEPURAÇÃO ---
    // Verificar se o GitHub retornou um erro de GraphQL
    if (pinnedData.errors) {
      console.error('ERRO DO GRAPHQL:', pinnedData.errors);
      throw new Error('Erro ao buscar dados do GraphQL do GitHub.');
    }
    // -------------------------

    const pinnedRepos = pinnedData.data.user.pinnedItems.nodes;

    // 2. Buscar as estatísticas de linguagem
    const resRepos = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 3600, // Cache
        },
      }
    );

    const repos = await resRepos.json();
    
    // --- MELHOR DEPURAÇÃO ---
    // Verificar se a API REST retornou um erro (ex: token inválido)
    if (!resRepos.ok) {
      console.error('ERRO DA API REST:', repos);
      throw new Error('Erro ao buscar lista de repositórios do GitHub.');
    }
    // -------------------------

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

    console.log('REPOSITÓRIOS FIXADOS ENCONTRADOS:', pinnedRepos.length);
    console.log('LINGUAGENS ENCONTRADAS:', Object.keys(langStats).length);

    // Retornar os dados combinados
    return NextResponse.json({
      pinnedRepos,
      langStats,
    });

  } catch (error) {
    console.error('ERRO GERAL NA API /api/github:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do GitHub' },
      { status: 500 }
    );
  }

}