import z from 'zod';

export const pageSchema = z.coerce.number().int().min(0).catch(0).default(0);

export const searchSchema = z.string().min(2).max(64).catch('');
