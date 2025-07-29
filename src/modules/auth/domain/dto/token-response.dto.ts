import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    example: 'exemplo@email.com',
    description: 'E-mail do administrador autenticado',
  })
  email: string;

  @ApiProperty({
    example: 1,
    description: 'ID do administrador (sub)',
  })
  id: number;
}
