import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class MarkAsReadDto {
    @ApiProperty({
        description: "IDs (UUID) das notificações a serem marcadas como lidas.",
        example: ["a3f9c1b4-7d2e-4b9e-8a6d-1f2c3b4a5e6f", "7e2a9d6f-3c4b-4e8f-9a1d-6b7c8e9f0a1b", "ids-exemplo"],
    })
    @IsArray({
        message: "O campo notificationIds deve ser um array.",
    })
    @IsString({
        each: true,
        message: "Cada item de notificationIds deve ser uma string.",
    })
    notificationIds: string[];
}