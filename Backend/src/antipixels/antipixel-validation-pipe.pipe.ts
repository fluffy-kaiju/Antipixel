import { Injectable, PipeTransform } from '@nestjs/common';
import { createHash } from 'node:crypto';

export class FileWithHash {
    file: Express.Multer.File;
    shasum256: string;
}


@Injectable()
export class FileHashPipe implements PipeTransform {
    transform(value: Express.Multer.File): FileWithHash {
        const hash = createHash('sha256').update(value.buffer).digest('hex');

        return {
            file: value,
            shasum256: hash
        };
    }
}
