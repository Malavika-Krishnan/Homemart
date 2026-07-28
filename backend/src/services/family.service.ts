import { Types } from 'mongoose';
import { Family, IFamily } from '../models/family.model';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../utils/customError';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FAM-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class FamilyService {
  public static async createFamily(userId: string, name: string): Promise<IFamily> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    if (user.familyId) throw new BadRequestError('User already belongs to a family');

    let inviteCode = generateInviteCode();
    while (await Family.findOne({ inviteCode })) {
      inviteCode = generateInviteCode();
    }

    const family = await Family.create({
      name,
      inviteCode,
      ownerId: new Types.ObjectId(userId),
      members: [
        {
          userId: new Types.ObjectId(userId),
          role: 'ADMIN',
          joinedAt: new Date(),
        },
      ],
    });

    user.familyId = family._id;
    user.role = 'ADMIN';
    await user.save();

    return family;
  }

  public static async joinFamily(userId: string, inviteCode: string): Promise<IFamily> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    if (user.familyId) throw new BadRequestError('User already belongs to a family');

    const family = await Family.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!family) throw new NotFoundError('Invalid invite code');

    const isMember = family.members.some((m) => m.userId.toString() === userId);
    if (isMember) throw new ConflictError('User is already a member of this family');

    const existingMemberUserIds = family.members.map((m) => m.userId);

    family.members.push({
      userId: new Types.ObjectId(userId),
      role: 'MEMBER',
      joinedAt: new Date(),
    });
    await family.save();

    user.familyId = family._id;
    user.role = 'MEMBER';
    await user.save();

    // Trigger notification to existing members
    await NotificationService.notifyFamilyMembers(
      family._id,
      userId,
      'MEMBER_JOINED',
      'New Family Member Joined',
      `${user.name} joined ${family.name}!`,
      existingMemberUserIds
    );

    return family;
  }

  public static async getFamilyDetails(familyId: string): Promise<IFamily> {
    const family = await Family.findById(familyId).populate('members.userId', 'name email avatarUrl role');
    if (!family) throw new NotFoundError('Family not found');
    return family;
  }

  public static async generateInviteCode(familyId: string, userId: string): Promise<{ inviteCode: string; inviteLink: string }> {
    const family = await Family.findById(familyId);
    if (!family) throw new NotFoundError('Family not found');

    const member = family.members.find((m) => m.userId.toString() === userId);
    if (!member || member.role !== 'ADMIN') {
      throw new ForbiddenError('Only family admins can generate invite codes');
    }

    let newCode = generateInviteCode();
    while (await Family.findOne({ inviteCode: newCode })) {
      newCode = generateInviteCode();
    }

    family.inviteCode = newCode;
    await family.save();

    return {
      inviteCode: newCode,
      inviteLink: `/join?code=${newCode}`,
    };
  }

  public static async inviteMember(familyId: string, senderId: string, email: string): Promise<void> {
    const family = await Family.findById(familyId);
    if (!family) throw new NotFoundError('Family not found');

    const sender = await User.findById(senderId);
    const targetUser = await User.findOne({ email: email.toLowerCase() });
    if (!targetUser) throw new NotFoundError('No registered user found with that email address');

    if (targetUser.familyId) throw new BadRequestError('User is already a member of a family');

    // Create notification for target user with permanent invite code
    await NotificationService.createNotification(
      targetUser._id,
      'FAMILY_UPDATE',
      'Family Invitation',
      `${sender?.name || 'A user'} invited you to join ${family.name}! Use invite code: ${family.inviteCode}`,
      family._id,
      { inviteCode: family.inviteCode }
    );
  }

  public static async removeMember(familyId: string, adminUserId: string, targetMemberId: string): Promise<IFamily> {
    const family = await Family.findById(familyId);
    if (!family) throw new NotFoundError('Family not found');

    const adminMember = family.members.find((m) => m.userId.toString() === adminUserId);
    if (!adminMember || adminMember.role !== 'ADMIN') {
      throw new ForbiddenError('Only family admins can remove members');
    }

    if (adminUserId === targetMemberId) {
      throw new BadRequestError('Family owner/admin cannot remove themselves. Use leave family instead.');
    }

    const memberIndex = family.members.findIndex((m) => m.userId.toString() === targetMemberId);
    if (memberIndex === -1) throw new NotFoundError('Member not found in family');

    family.members.splice(memberIndex, 1);
    await family.save();

    await User.findByIdAndUpdate(targetMemberId, { familyId: null, role: 'MEMBER' });

    return family;
  }

  public static async manageMemberRole(
    familyId: string,
    adminUserId: string,
    targetMemberId: string,
    newRole: 'ADMIN' | 'MEMBER'
  ): Promise<IFamily> {
    const family = await Family.findById(familyId);
    if (!family) throw new NotFoundError('Family not found');

    const adminMember = family.members.find((m) => m.userId.toString() === adminUserId);
    if (!adminMember || adminMember.role !== 'ADMIN') {
      throw new ForbiddenError('Only family admins can change member roles');
    }

    const member = family.members.find((m) => m.userId.toString() === targetMemberId);
    if (!member) throw new NotFoundError('Member not found in family');

    member.role = newRole;
    await family.save();

    await User.findByIdAndUpdate(targetMemberId, { role: newRole });

    return family;
  }

  public static async leaveFamily(userId: string, familyId: string): Promise<void> {
    const family = await Family.findById(familyId);
    if (!family) throw new NotFoundError('Family not found');

    const memberIndex = family.members.findIndex((m) => m.userId.toString() === userId);
    if (memberIndex === -1) throw new BadRequestError('User is not a member of this family');

    family.members.splice(memberIndex, 1);

    if (family.members.length === 0) {
      await Family.findByIdAndDelete(familyId);
    } else {
      if (family.ownerId.toString() === userId) {
        // Transfer ownership to next admin or first member
        const nextAdmin = family.members.find((m) => m.role === 'ADMIN') || family.members[0];
        nextAdmin.role = 'ADMIN';
        family.ownerId = nextAdmin.userId;
        await User.findByIdAndUpdate(nextAdmin.userId, { role: 'ADMIN' });
      }
      await family.save();
    }

    await User.findByIdAndUpdate(userId, { familyId: null, role: 'MEMBER' });
  }
}
