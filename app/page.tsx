// src/app/page.tsx
'use client';

import useSWR from 'swr';

// --- INTERFACES DO GITHUB ---
interface Repo {
  id: string;
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  };
}
interface LangStats {
  [key: string]: {
    count: number;
    color?: string;
  };
}
interface GitHubData {
  pinnedRepos: Repo[];
  langStats: LangStats;
}

// --- INTERFACES DO WAKATIME (SIMPLIFICADAS) ---
interface WakaTimeData {
  human_readable_total_including_other_language: string;
  human_readable_daily_average_including_other_language: string;
  languages: {
    name: string;
    percent: number;
    text: string;
  }[];
}

// --- FETCHER GLOBAL ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- COMPONENTE DE LOADING (SKELETON) ---
// Um componente simples para usar enquanto os dados carregam
function SkeletonCard() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

// --- WIDGET DO GITHUB ---
function GithubWidget() {
  const { data, error, isLoading } = useSWR<GitHubData>('/api/github', fetcher);

  if (isLoading) return <SkeletonCard />;
  if (error) return <div className="p-4 bg-red-900 rounded-lg">Erro ao carregar dados do GitHub.</div>;
  if (!data) return null;

  return (
    <>
      {/* Seção 1: Repositórios Fixados */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">Repositórios Fixados</h2>
        <div className="grid grid-cols-1 gap-4">
          {data.pinnedRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-bold text-lg text-blue-400">{repo.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                {repo.primaryLanguage && (
                  <span className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-1.5"
                      style={{ backgroundColor: repo.primaryLanguage.color }}
                    />
                    {repo.primaryLanguage.name}
                  </span>
                )}
                <span>⭐ {repo.stargazerCount}</span>
                <span>🍴 {repo.forkCount}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Seção 2: Estatísticas de Linguagem */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">Estatísticas de Linguagens</h2>
        <div className="p-4 bg-gray-800 rounded-lg">
          <ul className="space-y-2">
            {Object.entries(data.langStats)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([lang, { count, color }]) => (
                <li key={lang} className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color || '#ccc' }}
                    />
                    {lang}
                  </span>
                  <span className="font-mono bg-gray-700 px-2 py-0.5 rounded text-sm text-white">
                    {count} {count > 1 ? 'repos' : 'repo'}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}

// --- WIDGET DO WAKATIME ---
function WakaTimeWidget() {
  const { data, error, isLoading } = useSWR<WakaTimeData>('/api/wakatime', fetcher);

  if (isLoading) return <SkeletonCard />;
  if (error) return <div className="p-4 bg-red-900 rounded-lg">Erro ao carregar dados do WakaTime.</div>;
  if (!data) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-white">Atividade (Últimos 7 dias)</h2>
      <div className="p-4 bg-gray-800 rounded-lg">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Total</div>
            <div className="text-2xl font-bold text-white">
              {data.human_readable_total_including_other_language}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Média Diária</div>
            <div className="text-2xl font-bold text-white">
              {data.human_readable_daily_average_including_other_language}
            </div>
          </div>
        </div>
        
        {/* Linguagens */}
        <h3 className="text-lg font-semibold mb-2 text-white">Linguagens</h3>
        <ul className="space-y-2">
          {data.languages.slice(0, 5).map((lang) => ( // Mostra as 5+ usadas
            <li key={lang.name} className="text-gray-300">
              <div className="flex justify-between text-sm mb-1">
                <span>{lang.name}</span>
                <span>{lang.text} ({lang.percent}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${lang.percent}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


// --- PÁGINA PRINCIPAL ---
export default function Home() {
  return (
    <main className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">Dev-Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna 1: WakaTime */}
        <div className="space-y-8">
          <WakaTimeWidget />
        </div>

        {/* Coluna 2: GitHub */}
        <div className="space-y-8">
          <GithubWidget />
        </div>

      </div>
    </main>
  );
}