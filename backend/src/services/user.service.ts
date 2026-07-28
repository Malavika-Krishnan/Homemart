import { User, IUser } from '../models/user.model';
import { NotFoundError, BadRequestError } from '../utils/customError';
import { UpdateProfileInput, UpdateAvatarInput, ChangePasswordInput } from '../validators/user.validator';

export class UserService {
  public static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  public static async updateProfile(userId: string, data: UpdateProfileInput): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  public static async updateAvatar(userId: string, data: UpdateAvatarInput): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: data.avatarUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  public static async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Incorrect current password');
    }

    user.password = data.newPassword;
    await user.save();
  }
}
