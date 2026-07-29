import type {BrandResultProps} from './types';

const IMG_TOKEN = process.env.EXPO_PUBLIC_LOGODEV_IMG_TOKEN;

const brand = (name: string, domain: string): BrandResultProps => ({
  name,
  domain,
  logo_url: `https://img.logo.dev/${domain}?token=${IMG_TOKEN}`,
});

export const POPULAR_BRANDS: BrandResultProps[] = [
  brand('Netflix', 'netflix.com'),
  brand('Disney+', 'disneyplus.com'),
  brand('Prime Video', 'primevideo.com'),
  brand('Max', 'max.com'),
  brand('Spotify', 'spotify.com'),
  brand('YouTube Premium', 'youtube.com'),
  brand('Apple Music', 'music.apple.com'),
  brand('Paramount+', 'paramountplus.com'),
  brand('Crunchyroll', 'crunchyroll.com'),
  brand('ViX', 'vix.com'),
  brand('Deezer', 'deezer.com'),
  brand('DIRECTV GO', 'directvgo.com'),
];
