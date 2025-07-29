import { AuthResponseDto } from "../dto/auth-reponse.dto";
import { LoginDto } from "../dto/login.dto";


export interface IAuthService {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  validateUser(payload: any): Promise<any>;
}