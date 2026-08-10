import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive, IsString } from 'class-validator';
import { GetAllTagsEntity, TagEntity } from 'src/tags/entities/tag.entity';

export class AntipixelResponseEntity {

    @ApiProperty({ description: "Antipixel id" })
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

    @ApiProperty({ description: "Antipixel sha256sum" })
    @IsString()
    @Expose()
    hash: string;

    constructor(p: Partial<AntipixelResponseEntity> & { hashToAntipixel: { hash: string } }) {
        Object.assign(this, p);
        this.hash = p?.hashToAntipixel?.hash ?? p.hash;
    }
}


export class TagAffectedByOperation {

    @Expose()
    @IsPositive()
    id: number;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    description: string;

    constructor(p: Partial<TagEntity>) {
        Object.assign(this, p);
    }
}


export class AntipixelAffectedByOperation {

    @ApiProperty({ description: "Antipixel id" })
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

    constructor(p: Partial<AntipixelResponseEntity> & { hashToAntipixel: { hash: string } }) {
        Object.assign(this, p);
    }
}

export class AddTagsToAntiFailed {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    @ApiProperty({
        description: "Reason",
    })
    @Expose()
    reason: string;

    constructor(p: Partial<AddTagsToAntiFailed>) {
        Object.assign(this, p);
    }

}
export class AddTagsToAntiSuccess {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    @ApiProperty({
        description: "The antipixel affected",
        type: AntipixelAffectedByOperation,
    })
    @Expose()
    @Type(() => AntipixelAffectedByOperation)
    antipixel: AntipixelAffectedByOperation;

    @ApiProperty({
        description: "The assigned tags",
        type: TagAffectedByOperation,
    })
    @Expose()
    @Type(() => TagAffectedByOperation)
    tag: TagAffectedByOperation;

    constructor(p: Partial<AddTagsToAntiSuccess>) {
        Object.assign(this, p);
    }
}

export class AddTagsToAntiResponseEntity {

    @ApiProperty({
        description: "Successfully applied",
        isArray: true,
        type: AddTagsToAntiSuccess,
    })
    @Expose()
    @Type(() => AddTagsToAntiSuccess)
    successfully: AddTagsToAntiSuccess[];


    @ApiProperty({
        description: "Failed assignation",
        isArray: true,
        type: AddTagsToAntiFailed
    })
    @Expose()
    @Type(() => AddTagsToAntiFailed)
    failed: AddTagsToAntiFailed[];

    constructor(p: Partial<AddTagsToAntiResponseEntity>) {
        Object.assign(this, p);
    }
}

export class RemoveTagsToAntiFailed {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    @ApiProperty({
        description: "Reason",
    })
    @Expose()
    reason: string;

    constructor(p: Partial<RemoveTagsToAntiFailed>) {
        Object.assign(this, p);
    }

}

export class RemoveTagsToAntiSuccess {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    @ApiProperty({
        description: "The antipixel affected",
        type: AntipixelAffectedByOperation,
    })
    @Expose()
    @Type(() => AntipixelAffectedByOperation)
    antipixel: AntipixelAffectedByOperation;

    @ApiProperty({
        description: "The tags removed",
        type: TagAffectedByOperation,
    })
    @Expose()
    @Type(() => TagAffectedByOperation)
    tag: TagAffectedByOperation;

    constructor(p: Partial<RemoveTagsToAntiSuccess>) {
        Object.assign(this, p);
    }
}

export class RemoveTagsToAntiResponseEntity {

    @ApiProperty({
        description: "Successfully removed",
        isArray: true,
        type: RemoveTagsToAntiSuccess,
    })
    @Expose()
    @Type(() => RemoveTagsToAntiSuccess)
    removed: RemoveTagsToAntiSuccess[];

    @ApiProperty({
        description: "Number of tag removed",
    })
    @Expose()
    removed_nb: number;

    @ApiProperty({
        description: "Failed assignation",
        isArray: true,
        type: RemoveTagsToAntiFailed
    })
    @Expose()
    @Type(() => RemoveTagsToAntiFailed)
    failed: RemoveTagsToAntiFailed[];

    constructor(p: Partial<RemoveTagsToAntiResponseEntity>) {
        Object.assign(this, p);
    }
}
