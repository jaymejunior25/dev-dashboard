import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Usando a variável
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dev Dashboard | Jayme Junior",
  description: "Painel de atividades de desenvolvimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      {/* Usamos a variável da fonte e suavização 'antialiased' */}
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-gray-200`}>
        {children}
      </body>
    </html>
  );
}
