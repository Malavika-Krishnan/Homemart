import { User, IUser } from '../models/user.model';
import { generateToken } from '../middlewares/auth.middleware';
import { BadRequestError, ConflictError, UnauthorizedError } from '../utils/customError';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
  public static async register(data: RegisterInput): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
    });

    const token = generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  public static async login(data: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userWithoutPassword = await User.findById(user._id).select('-password');
    const token = generateToken(user._id.toString(), user.email);

    return { user: userWithoutPassword!, token };
  }
}
