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

export class AntipixelResponseEntity {

    @ApiProperty({ description: "Antipixel id"})
    @IsNumber()
    @Expose()
    id: number;

    @ApiProperty({ description: "Antipixel name" })
    @IsString()
    @Expose()
    name: string;

    @ApiProperty({ description: "Antipixel bucket path. Note: this is not a url, but the path of the bucket object" })
    @IsString()
    @Expose()
    path: string;

    @ApiProperty({ description: "Antipixel description" })
    @IsString()
    @Expose()
    description: string;

    @ApiProperty({ description: "User if of the submitter" })
    @Type(() => Number)
    @IsNumber()
    @Expose()
    userId: number;

    @ApiProperty({ description: "Antipixel creation date" })
    @IsDate()
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: "Antipixel creation date" })
    @IsString()
    @Expose()
    hash: string;

    constructor(p: Partial<AntipixelResponseEntity> & { hashToAntipixel: { hash: string } }) {
        Object.assign(this, p);
        this.hash = p?.hashToAntipixel?.hash ?? p.hash;
    }
}
