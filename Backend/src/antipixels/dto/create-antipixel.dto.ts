import { ConflictException, HttpException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";


const mb = 1000000;
export const CreateAntipixelMaxUploadSize = mb * 1.4;

export enum ECreateAntipixelStatus {
    OK = 'ok',
    FAILED = 'failed',
    DUPLICATE = 'duplicate',
}

export class CreateAntipixelDto {

    @ApiProperty({
        description: "Name of the antipixel",
    })
    @IsString()
    @Length(3, 24)
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    // Add the file property for Swagger
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    file: Express.Multer.File;
}

export class CreateAntipixelEntity {

    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    path: string

    @IsString()
    @Expose()
    upload_status: string = ECreateAntipixelStatus.OK;

    constructor(p: Partial<CreateAntipixelEntity>) {
        Object.assign(this, p);
    }

}

export class CreateAntipixelDuplicateHashException extends ConflictException {
    @Expose()
    @IsString()
    upload_status: string = ECreateAntipixelStatus.DUPLICATE;

    @Expose()
    @IsNumber()
    duplicateOfId: number;

    constructor(p: { duplicateOfId: number }) {
        super({
            upload_status: ECreateAntipixelStatus.DUPLICATE,
            duplicateOfId: p.duplicateOfId,
        });
        Object.assign(this, p);
    }
}
