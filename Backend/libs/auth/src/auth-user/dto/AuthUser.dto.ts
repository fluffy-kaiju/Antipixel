import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator"

export class AuthUserTokenEntity {

    @IsNumber()
    @Expose()
    id: number;

    @IsString()
    @Expose()
    userName: string;

    constructor(p: Partial<AuthUserTokenEntity>) {
        Object.assign(this, p);
    }

}

// export enum Permission {

//     All = 'all',

//     AntipixelCreate     = 'antipixel.create',
//     AntipixelDelete     = 'antipixel.delete',
//     AntipixelTagAdd     = 'antipixel.tag.add',
//     AntipixelTagRemove  = 'antipixel.tag.add',

//     TagCreate   = 'tag.create',
//     TagUpdate   = 'tag.update',

// }
