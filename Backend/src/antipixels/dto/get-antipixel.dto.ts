import { ApiProperty } from "@nestjs/swagger";

import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Min } from "class-validator";
import { Expose, Type } from "class-transformer";
import { NotFoundException } from "@nestjs/common";

export class GetAntiAllDto {

    @ApiProperty({
        description: "Maximum of element to return"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number;

    @ApiProperty({
        description: "Number of record to skip"
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    offset?: number;
}

export class GetAntiByIdDto {

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id: number;

}

export class AntiNotFound extends NotFoundException {

    @ApiProperty({ description: "Reason", example: "Antipixel not found" })
    @Expose()
    message: string;

    constructor() {
        super("Antipixel not found");
    }
}

