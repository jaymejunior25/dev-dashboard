'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FiClock, FiCode, FiTrendingUp } from 'react-icons/fi';
import { SkeletonCard } from './SkeletonLoader';
import { fetcher } from '@/lib/fetcher'; // Importado de lib
import { WakaTimeData } from '@/lib/types'; // Importado de lib

// --- COMPONENTES AUXILIARES (Seu código estava ótimo) ---
const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
}) => (
  <div className="text-center p-3 bg-gray-700/20 rounded-lg">
    <div className="mb-1 mx-auto w-fit"> {/* w-fit centraliza o ícone */}
      <Icon size={18} color="#60a5fa" />
    </div>
    <div className="text-xs text-gray-400">{label}</div>
    <div className="text-sm font-semibold text-white">{value}</div>
  </div>
);

const LanguageBar = ({
  name,
  percent,
  text,
  index,
}: {
  name: string;
  percent: number;
  text: string;
  index: number;
}) => {
  const variants = {
    initial: { width: 0, opacity: 0 },
    animate: {
      width: `${percent}%`,
      opacity: 1,
      transition: {
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="text-gray-300"
    >
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span className="text-gray-400">{text} ({percent.toFixed(1)}%)</span>
      </div>
      <div className="h-2 bg-gray-700/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
          variants={variants}
          initial="initial"
          animate="animate"
        />
      </div>
    </motion.li>
  );
};

// --- COMPONENTE PRINCIPAL (agora é o próprio card) ---
export function WakaTimeWidget() {
  const { data, error, isLoading } = useSWR<WakaTimeData>('/api/wakatime', fetcher);

  // Card de Erro
  if (error)
    return (
      <div className="p-6 bg-red-900/50 rounded-xl border border-red-700/50">
        <p className="text-red-200">Erro ao carregar dados do WakaTime.</p>
      </div>
    );

  // Card de Skeleton
  if (isLoading) return <SkeletonCard type="wakatime" />;

  // Card de "Sem Dados"
  if (!data || !data.stats_7_days || !data.stats_all_time || data.stats_all_time.total_seconds === 0)
    return (
      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <h2 className="flex items-center gap-3 text-2xl font-semibold mb-2 text-white">
          <FiClock size={20} color="#60a5fa" /> Atividade de Codificação
        </h2>
        <p className="text-gray-400">Ainda sem dados de codificação. (Lembre-se: WakaTime só mostra dias passados).</p>
      </div>
    );

  const { stats_7_days, stats_all_time } = data;

  // Card de Sucesso
  return (
    <section className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/40">
      <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 text-white">
        <FiClock size={20} color="#60a5fa" /> 
        Atividade de Codificação
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={FiClock} label="Total" value={stats_all_time.text} />
          <StatCard icon={FiCode} label="7 dias" value={stats_7_days.human_readable_total_including_other_language} />
          <StatCard icon={FiTrendingUp} label="Média" value={stats_7_days.human_readable_daily_average_including_other_language} />
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-white">Linguagens (7 dias)</h3>
          <ul className="space-y-3">
            {stats_7_days.languages.slice(0, 5).map((lang, index) => (
              <LanguageBar key={lang.name} name={lang.name} percent={lang.percent} text={lang.text} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
