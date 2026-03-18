import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class SaveVisitorTermDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsISO8601()
  @IsNotEmpty()
  signedAt: string;
}
