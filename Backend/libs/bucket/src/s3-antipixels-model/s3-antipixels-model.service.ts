import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../s3.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3AntipixelsModelService {

    constructor(
        private readonly s3: S3Service,
    ) { }

    private readonly logger = new Logger(S3AntipixelsModelService.name);

    public async s3UploadAntipixel(data: {
        buffer: Buffer,
        key: string,
        originalFileName: string,
        mimeType: string,
        shasum256: string
    }) {

        this.logger.verbose(`uploading file with s3 key: ${data.key}`);

        const put_command = new PutObjectCommand({
            Bucket: this.s3.getBucketName(),
            Body: data.buffer,
            Key: data.key,
            ContentType: data.mimeType, // seems to not affect `mime type` proprety for seaweedfs :/
            Metadata: {
                'content-type': data.mimeType,
                'shasum256': data.shasum256,
            }

        });
        return await this.s3.client.send(put_command);
    }
}
