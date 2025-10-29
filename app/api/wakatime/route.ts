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
    const auth = Buffer.from(apiKey).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
    };
    
    // Buscamos os DOIS endpoints ao mesmo tempo
    const [res7Days, resAllTime] = await Promise.all([
      // Endpoint 1: Últimos 7 dias
      fetch(
        'https://wakatime.com/api/v1/users/current/stats/last_7_days',
        { headers, next: { revalidate: 3600 } } // Cache de 1 hora
      ),
      // Endpoint 2: Tempo total
      fetch(
        'https://wakatime.com/api/v1/users/current/all_time_since_today',
        { headers, next: { revalidate: 3600 } } // Cache de 1 hora
      ),
    ]);

    if (!res7Days.ok || !resAllTime.ok) {
      console.error('Falha ao buscar dados do WakaTime');
      throw new Error('Falha ao buscar dados do WakaTime');
    }

    const data7Days = await res7Days.json();
    const dataAllTime = await resAllTime.json();

    // Retornamos um objeto combinado
    return NextResponse.json({
      stats_7_days: data7Days.data,
      stats_all_time: dataAllTime.data,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do WakaTime' },
      { status: 500 }
    );
  }
}
