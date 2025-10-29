'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { WakaTimeWidget } from '@/components/WakaTimeWidget';
import { PinnedReposWidget } from '@/components/PinnedReposWidget';
import { LangStatsWidget } from '@/components/LangStatsWidget';

export default function Home() {
  // Variantes para animar o container do grid
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: 0.1, // Atraso para animar após o header
        staggerChildren: 0.15, // Anima widgets um após o outro
      },
    },
  };

  // Variantes para animar os widgets individuais
  const gridItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    // Fundo é definido no layout.tsx
    <div className="min-h-screen">
      <Header />

      <motion.main 
        className="max-w-7xl mx-auto p-6 lg:p-8"
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Layout de 3 colunas em telas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna da Esquerda (1/3) */}
          <motion.div className="lg:col-span-1 space-y-6" variants={gridItemVariants}>
            <WakaTimeWidget />
            <LangStatsWidget />
          </motion.div>

          {/* Coluna da Direita (2/3) */}
          <motion.div className="lg:col-span-2" variants={gridItemVariants}>
            <PinnedReposWidget />
          </motion.div>

        </div>
      </motion.main>
    </div>
  );
}
