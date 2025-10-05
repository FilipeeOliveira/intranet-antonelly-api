import { PartialType } from '@nestjs/swagger';
import { CreateCompanieDto } from './create-companie.dto';

export class UpdateCompanieDto extends PartialType(CreateCompanieDto) {}
