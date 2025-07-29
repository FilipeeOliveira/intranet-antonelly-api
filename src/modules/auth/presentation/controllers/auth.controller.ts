import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../domain/dto/login.dto';
import { AuthResponseDto } from '../../domain/dto/auth-reponse.dto';


@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ 
    type: LoginDto,
    description: 'Credenciais de login do usuário',
  })
  @ApiOkResponse({ 
    type: AuthResponseDto,
    description: 'Login realizado com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas ou usuário inativo',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}