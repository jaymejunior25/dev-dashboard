/**
 * Função 'fetcher' global para SWR.
 * Busca a URL e retorna o JSON.
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
