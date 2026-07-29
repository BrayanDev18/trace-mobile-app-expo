export const sizedLogo = (url: string, displaySize: number) =>
  `${url}${url.includes('?') ? '&' : '?'}size=${displaySize * 2}`;
