const OWNER_EMAIL = 'estefa.eche@gmail.com';

export const isOwner = (email?: string) => email?.trim().toLowerCase() === OWNER_EMAIL;
