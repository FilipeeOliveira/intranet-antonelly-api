import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateRoleDto {
    @ApiProperty({ example: "ADMIN", required: false })
    @IsString()
    @IsOptional()
    key?: string;

    @ApiProperty({ example: "Administrador com acesso total", required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
