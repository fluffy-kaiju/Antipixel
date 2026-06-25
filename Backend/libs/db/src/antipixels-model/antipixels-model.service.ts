import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3AntipixelsModelService } from '@bucket/bucket/s3-antipixels-model/s3-antipixels-model.service';
import { S3ServiceException } from '@aws-sdk/client-s3';
import { CreateAntipixelDuplicateHashException } from 'src/antipixels/dto/create-antipixel.dto';

@Injectable()
export class AntipixelsModelService {
    private readonly logger = new Logger(AntipixelsModelService.name);

    constructor(
        private prisma: PrismaService,
        private s3Anti: S3AntipixelsModelService,
    ) { }

    async getIdFromSha256(sha256: string) {
        return this.prisma.hashToAntipixel.findUnique({
           where: {
             hash: sha256,
           },
            select: {
                id: true,
            },
        }).then((val) => val?.id ?? null);
    }

    async newAntipixel(data: {
        name: string,
        description: string,
        submittedBy: number,
        fileBuffer: Buffer,
        fileMimeType: string,
        originalFileName: string,
        fileShasum256: string,
    }) {

        const check_dupe = await this.getIdFromSha256(data.fileShasum256);
        if (check_dupe !== null) {
            throw new CreateAntipixelDuplicateHashException({duplicateOfId: check_dupe});
        }

        const s3key = `${data.fileShasum256}/${data.originalFileName}`;

        const upload = await this.s3Anti.s3UploadAntipixel({
            key: s3key,
            buffer: data.fileBuffer,
            mimeType: data.fileMimeType,
            originalFileName: data.originalFileName,
            shasum256: data.fileShasum256
        })
            .catch(async (err) => {
                if (err instanceof S3ServiceException) {
                    this.logger.error(`Error from the ${err.$fault} while uploading ${s3key}`);
                    this.logger.error(err.message)
                } else {
                    this.logger.error(`Unknown error while uploading ${s3key}`);
                    this.logger.error(err);
                }
                throw new InternalServerErrorException('Upload failed');
            })
        return await this.prisma.antipixel.create({
            data: {
                name: data.name,
                description: data.description,
                path: s3key,
                hashToAntipixel: {
                    connectOrCreate: {
                        create: {
                            hash: data.fileShasum256,
                        },
                        where: {
                            hash: data.fileShasum256,
                        }
                    }
                },
                submittedBy: {
                    connect: {
                        id: data.submittedBy,
                    }
                }
            }

        });
    }
}
