import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';

import { S3Client, S3ClientConfigType, CreateBucketCommand, BucketCannedACL, BucketAlreadyExists, BucketAlreadyOwnedByYou, PutObjectCommand } from "@aws-sdk/client-s3"
import { ConfigService } from '@nestjs/config';

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

        const command = new CreateBucketCommand({
            Bucket: bucketName,
            ACL: BucketCannedACL.public_read
        })

        await this.client.send(command)
            .then(() => {
                this.logger.verbose(`Bucket ${bucketName} created!`)
            })
            .catch((error) => {
                if (error instanceof BucketAlreadyExists ||
                    error instanceof BucketAlreadyOwnedByYou) {
                    this.logger.verbose(`Bucket ${bucketName} exist!`)
                    return;
                }
                throw new InternalServerErrorException("Unhandled error CreateBucketCommand", {cause: error.message});
            })
    }

    public async uplaodObjectWithSha256AsKey(Buffer: Object) {

        // TODO Get the file uploaded from the user and calc the hash
        // const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const test_command = new PutObjectCommand({Bucket: this.bucketName, Body: "Test", Key: "tonpere2"})
        const test_res = await this.client.send(test_command);
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
