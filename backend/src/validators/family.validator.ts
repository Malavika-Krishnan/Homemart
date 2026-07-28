import { z } from 'zod';

export const createFamilySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Family name must be at least 2 characters long').max(100),
  }),
});

export const joinFamilySchema = z.object({
  body: z.object({
    inviteCode: z.string().min(1, 'Invite code is required'),
  }),
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
});

export const manageRoleSchema = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'MEMBER']),
  }),
  params: z.object({
    memberId: z.string().min(1, 'Member ID is required'),
  }),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>['body'];
export type JoinFamilyInput = z.infer<typeof joinFamilySchema>['body'];
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>['body'];
export type ManageRoleInput = z.infer<typeof manageRoleSchema>['body'];
