import { z } from 'zod';

const syncOperationSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'TOGGLE_PURCHASE']),
  entity: z.enum(['list', 'item']),
  entityId: z.string().optional(),
  clientItemId: z.string().optional(),
  listId: z.string().optional(),
  data: z.record(z.any()).optional(),
  clientTimestamp: z.string().or(z.number()),
});

export const syncBatchSchema = z.object({
  body: z.object({
    clientTimestamp: z.string().or(z.number()),
    operations: z.array(syncOperationSchema).min(1, 'At least one operation is required for sync'),
  }),
});

export type SyncOperation = z.infer<typeof syncOperationSchema>;
export type SyncBatchInput = z.infer<typeof syncBatchSchema>['body'];
