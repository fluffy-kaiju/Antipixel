import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';

import { S3Client, S3ClientConfigType, CreateBucketCommand, BucketCannedACL, BucketAlreadyExists, BucketAlreadyOwnedByYou, PutObjectCommand, GetBucketPolicyCommand, GetBucketPolicy$, NoSuchBucket, PutBucketAbacCommandInput, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service implements OnModuleInit {
    constructor(
        private configService: ConfigService
    ) { }

    private readonly logger = new Logger(S3Service.name);
    private s3ClientConfig: S3ClientConfigType;

    private bucketName: string;
    public client: S3Client;

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
    }

    getBucketName() {
        return this.bucketName;
    }

}
