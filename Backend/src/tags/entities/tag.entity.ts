import { ETagsStatus } from "@db/db/prisma/generated/enums";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, IsEnum, IsPositive, IsString } from "class-validator";


export class TagEntity {

    @Expose()
    @IsPositive()
    id: number;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    description: string;

    @Expose()
    @IsEnum(ETagsStatus)
    status: ETagsStatus

    @Expose()
    @IsPositive()
    createByUserId: number;

    @Expose()
    @IsString()
    createByUserName: string;

    @ApiProperty({ description: "Tag creation date" })
    @IsDate()
    @Expose()
    createdAt: Date;

    constructor(p: Partial<TagEntity> & { createdBy: { id: number, userName: string } }) {
        Object.assign(this, p);
        this.createByUserId = p?.createdBy?.id;
        this.createByUserName = p?.createdBy?.userName;
    }
}

export class GetAllTagsEntity {

    @ApiProperty({ type: [TagEntity], description: 'List of antipixels.' })
    @Expose()
    @Type(() => TagEntity)
    tags: TagEntity[];

    @ApiProperty({ example: 25, description: 'Current cursor id.' })
    @Expose()
    cursor: number;

    @ApiProperty({ example: 50, description: 'Number of items per page.' })
    @Expose()
    pageSize: number;

    @ApiProperty({ example: 50, description: 'Total number of antipixels.' })
    @Expose()
    numberOfAntipixels: number;

    constructor(p: Partial<GetAllTagsEntity>) {
        Object.assign(this, p);
    }

}
