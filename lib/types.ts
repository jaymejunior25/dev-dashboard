// --- Tipos do GitHub ---
export interface Repo {
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

export interface LangStats {
  [key: string]: {
    count: number;
    color?: string;
  };
}

// Interface principal de dados do GitHub (inclui dados do Header)
export interface GitHubData {
  avatarUrl: string;
  name: string;
  pinnedRepos: Repo[];
  langStats: LangStats;
}

// --- Tipos do WakaTime ---
export interface WakaTimeStats {
  human_readable_total_including_other_language: string;
  human_readable_daily_average_including_other_language: string;
  languages: {
    name: string;
    percent: number;
    text: string;
  }[];
}

export interface WakaTimeAllTime {
  text: string;
  total_seconds: number;
}

// Interface principal de dados do WakaTime
export interface WakaTimeData {
  stats_7_days: WakaTimeStats;
  stats_all_time: WakaTimeAllTime;
}
