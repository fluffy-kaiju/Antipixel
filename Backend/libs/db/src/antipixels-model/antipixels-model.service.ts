import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3AntipixelsModelService } from '@bucket/bucket/s3-antipixels-model/s3-antipixels-model.service';
import { S3ServiceException } from '@aws-sdk/client-s3';
import { CreateAntipixelDuplicateHashException } from 'src/antipixels/dto/create-antipixel.dto';
import { overridePrismaFilter } from '../prisma/prisma.filter';
import { EAntipixelStatus } from '../prisma/generated/enums';

@Injectable()
export class AntipixelsModelService {
    private readonly logger = new Logger(AntipixelsModelService.name);

    constructor(
        private prisma: PrismaService,
        private s3Anti: S3AntipixelsModelService,
    ) { }

    async getIdFromSha256(sha256: string) {
        return this.prisma.hashToAntipixel.findUnique({
            where: { hash: sha256 },
            select: { id: true },
        }).then((val) => val?.id ?? null);
    }

    async newAntipixel(data: {
        name: string,
        description: string,
        submitterId: number,
        submitterUserName: string,
        fileBuffer: Buffer,
        fileMimeType: string,
        originalFileName: string,
        fileShasum256: string,
    }) {

        const check_dupe = await this.getIdFromSha256(data.fileShasum256);
        if (check_dupe !== null) {
            throw new CreateAntipixelDuplicateHashException({ duplicateOfId: check_dupe });
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
                        create: { hash: data.fileShasum256 },
                        where: { hash: data.fileShasum256 },
                    }
                },
                submittedBy: {
                    connect: { id: data.submitterId },
                },
                statusHistory: {
                    create: {
                        reason: `Antipixel submitted by ${data.submitterUserName}`,
                        changeMadeBy: {
                            connect: { id: data.submitterId },
                        },
                        status: EAntipixelStatus.OPEN,
                    }
                }
            }

        });
    };


    private defaultGetLimit = 50;

    async getAll(offset?: number, limit: number = this.defaultGetLimit) {
        return await this.prisma.antipixel.findMany({
            include: {
                hashToAntipixel: { select: { hash: true } },
            },
            take: limit,
            skip: offset,
        });
    };

    async getById(id: number) {
        return await this.prisma.antipixel.findFirstOrThrow({
            where: { id: id },
            include: {
                hashToAntipixel: { select: { hash: true } }
            }
        }).catch((e) =>
            overridePrismaFilter<null>(e, (err) => {
                if (err.code === 'P2025') {
                    this.logger.verbose(`Antipixel with ${id} id not found`);
                    return null;
                }
                throw e;
            })
        );
    };
}
