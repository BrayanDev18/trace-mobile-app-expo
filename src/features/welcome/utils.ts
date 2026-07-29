const SECRET = 'theone';

export const SECRET_LENGTH = SECRET.length;

export const matchesSecret = (value: string) => value.trim().toLowerCase() === SECRET;
