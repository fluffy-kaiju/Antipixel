import { ETagsStatus } from "@db/db/prisma/generated/enums";
import { Expose } from "class-transformer";
import { IsEnum, IsPositive, IsString } from "class-validator";

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
    @IsString()
    createByUserId: string;

    @Expose()
    @IsPositive()
    createByUserName: number;

    constructor(p: Partial<TagEntity>) {
        Object.assign(this, p);
    }
}
