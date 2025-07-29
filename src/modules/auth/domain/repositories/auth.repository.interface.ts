import { User } from '../entities/user.entity';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
}