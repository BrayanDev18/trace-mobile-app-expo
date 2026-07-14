import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

export type BrandResult = {
  name: string;
  domain: string;
  logo_url: string;
};

/** Pide el logo al tamaño mostrado (2x para retina) en vez del default del CDN. */
export const sizedLogo = (url: string, displaySize: number) =>
  `${url}${url.includes('?') ? '&' : '?'}size=${displaySize * 2}`;

const searchBrands = async (query: string): Promise<BrandResult[]> => {
  const response = await fetch(
    `https://api.logo.dev/search?q=${encodeURIComponent(query)}`,
    {headers: {Authorization: `Bearer ${process.env.EXPO_PUBLIC_LOGODEV_KEY}`}},
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

/** Espera a que el usuario deje de escribir antes de propagar el valor. */
const useDebounced = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export const useBrandSearch = (query: string) => {
  const q = useDebounced(query.trim());

  return useQuery({
    queryKey: ['brand-search', q],
    queryFn: () => searchBrands(q),
    enabled: q.length >= 2,
    staleTime: 1000 * 60 * 10,
  });
};
