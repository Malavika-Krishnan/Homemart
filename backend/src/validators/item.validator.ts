import { z } from 'zod';

const categoryEnum = z.enum([
  'Produce',
  'Dairy',
  'Meat',
  'Pantry',
  'Bakery',
  'Household',
  'Beverages',
  'Personal Care',
  'Frozen',
  'Other',
]);

const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const addItemSchema = z.object({
  body: z.object({
    listId: z.string().min(1, 'List ID is required'),
    name: z.string().min(1, 'Item name is required').max(100),
    category: categoryEnum.optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
    unit: z.string().optional(),
    priority: priorityEnum.optional(),
    notes: z.string().max(500).optional(),
    clientItemId: z.string().optional(),
  }),
});

export const editItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    category: categoryEnum.optional(),
    quantity: z.number().min(1).optional(),
    unit: z.string().optional(),
    priority: priorityEnum.optional(),
    isPurchased: z.boolean().optional(),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Item ID is required'),
  }),
});

export const updateQuantitySchema = z.object({
  body: z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  }),
  params: z.object({
    id: z.string().min(1, 'Item ID is required'),
  }),
});

export const updatePrioritySchema = z.object({
  body: z.object({
    priority: priorityEnum,
  }),
  params: z.object({
    id: z.string().min(1, 'Item ID is required'),
  }),
});

export type AddItemInput = z.infer<typeof addItemSchema>['body'];
export type EditItemInput = z.infer<typeof editItemSchema>['body'];
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>['body'];
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>['body'];
