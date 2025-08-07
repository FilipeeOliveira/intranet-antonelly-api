import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../domain/dto/login.dto';
import { AuthResponseDto } from '../../domain/dto/auth-reponse.dto';
import { ForgotPasswordDto } from '../../domain/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../domain/dto/reset-password.dto';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { AuthGuard } from '../guards/auth.guard';


@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentativas por minuto para login
  @ApiBody({ type: LoginDto, description: 'Credenciais de login do usuário'})
  @ApiOkResponse({type: AuthResponseDto, description: 'Login realizado com sucesso'})
  @ApiUnauthorizedResponse({description: 'Credenciais inválidas ou usuário inativo'})
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 tentativas por 5 minutos
  @ApiBody({ type: ForgotPasswordDto, description: 'Email para recuperação de senha'})
  @ApiOkResponse({ description: 'Link de recuperação enviado (se email existir)' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const result = await this.forgotPasswordUseCase.execute(forgotPasswordDto);
    return { message: result.message };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 tentativas por 5 minutos
  @ApiBody({ type: ResetPasswordDto, description: 'Token e nova senha para redefinição'})
  @ApiOkResponse({ description: 'Senha alterada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou expirado' })
  @ApiBadRequestResponse({ description: 'Senhas não coincidem ou formato inválido' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.resetPasswordUseCase.execute(resetPasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Logout realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou usuário não autenticado' })
  async logout(@Request() req: any): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.user.id;
    return this.logoutUseCase.execute(token, userId);
  }
}