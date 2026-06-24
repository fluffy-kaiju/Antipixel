import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';

import { S3Client, S3ClientConfigType, CreateBucketCommand, BucketCannedACL, BucketAlreadyExists, BucketAlreadyOwnedByYou, PutObjectCommand, GetBucketPolicyCommand, GetBucketPolicy$, NoSuchBucket } from "@aws-sdk/client-s3"
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import * as mime from 'mime-types';

@Injectable()
export class S3Service implements OnModuleInit {
    constructor(
        private configService: ConfigService
    ) { }

    private readonly logger = new Logger(S3Service.name);
    private client: S3Client;
    private bucketName: string;
    private s3ClientConfig: S3ClientConfigType;

    async onModuleInit() {

        this.s3ClientConfig = {
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESSKEY'),
            },
            endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
            region: this.configService.getOrThrow<string>('S3_REGION'),
            forcePathStyle: true
        };

        this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');

        this.client = new S3Client(this.s3ClientConfig);
        await this.bucketExistOrCreate(this.bucketName);
    }

    private async bucketExistOrCreate(bucketName: string): Promise<void> {

        const create_command = new CreateBucketCommand({
            Bucket: bucketName,
            ACL: BucketCannedACL.public_read
        })

        await this.client.send(create_command)
            .then(() => {
                this.logger.verbose(`Bucket ${bucketName} created!`)
            })
            .catch((error) => {
                if (error instanceof BucketAlreadyExists ||
                    error instanceof BucketAlreadyOwnedByYou) {
                    this.logger.verbose(`Bucket ${bucketName} exist!`)
                    return;
                }
                throw new InternalServerErrorException("Unhandled error CreateBucketCommand", { cause: error.message });
            })


        // TODO check if bucket policy is configured
        // const bucket_ressource_name = `${this.bucketName}`

        // const set_anonymous_access_command = new GetBucketPolicyCommand({Bucket: bucket_ressource_name});
        // await this.client.send(set_anonymous_access_command)
        //     .then((data) => {
        //         this.logger.debug(data);
        //     })
        //     .catch((error) => {
        //         // if (error instanceof NoSuchBucketPolicy) {
        //         //     this.logger.verbose(`Bucket ${bucketName} exist!`)
        //         //     return;
        //         // }
        //         throw error;
        //         throw new InternalServerErrorException("Unhandled error GetBucketPolicyCommand", { cause: error.message });
        //     })
    }

    public async s3UploadAntipixel(buffer: Buffer, originalFileName: string, mimeType: string, antipixelId: number, shasum256: string) {

        const s3Key = `${shasum256}/${originalFileName}`;

        this.logger.verbose(`Uploading file with S3 Key: ${s3Key}`);

        const put_command = new PutObjectCommand({
            Bucket: this.bucketName,
            Body: buffer,
            Key: s3Key,
            ContentType: mimeType, // Seems to not affect `MIME Type` proprety for seaweedfs :/
            Metadata: {
                'content-type': mimeType,
                'antipixel-id': String(antipixelId),
                'shasum256'   : shasum256,
            }

        });
        const test_res = await this.client.send(put_command);
        this.logger.verbose(test_res);
    }


    // private async isBucketExist(): Promise<boolean> {

    //     try {
    //         const command = new HeadBucketCommand({ Bucket: this.bucketNamePathStyle })
    //         await this.client.send(command);
    //         return true;


    //     } catch (error: any) {
    //         if (error instanceof NotFound) {
    //             return false;
    //         }
    //         throw new InternalServerErrorException(error);
    //     }
    // }

}
