import { z } from 'zod';

export const createListSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'List name is required').max(100),
    description: z.string().max(250).optional(),
    color: z.string().optional(),
  }),
});

export const updateListSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(250).optional(),
    color: z.string().optional(),
    isArchived: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'List ID is required'),
  }),
});

export type CreateListInput = z.infer<typeof createListSchema>['body'];
export type UpdateListInput = z.infer<typeof updateListSchema>['body'];
