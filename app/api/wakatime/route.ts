// src/app/api/wakatime/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chave da API do WakaTime não configurada' },
      { status: 500 }
    );
  }

  try {
    // A API do WakaTime usa autenticação "Basic" com a chave da API em Base64
    const auth = Buffer.from(apiKey).toString('base64');

    // Buscamos as estatísticas dos últimos 7 dias
    const res = await fetch(
      'https://wakatime.com/api/v1/users/current/stats/last_7_days',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        next: {
          revalidate: 3600, // Cache de 1 hora
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro do WakaTime:', errorText);
      throw new Error(`Erro ao buscar dados do WakaTime: ${res.statusText}`);
    }

    const data = await res.json();

    // A resposta do WakaTime vem dentro de um objeto "data"
    return NextResponse.json(data.data);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do WakaTime' },
      { status: 500 }
    );
  }
}