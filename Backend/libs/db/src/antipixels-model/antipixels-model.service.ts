import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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

    async addTag(data: {
        tagId: number,
        antipixelId: number,
        assignedById: number,
    }) {
        return await this.prisma.tagOnAntipixel.create({
            data: {
                antipixelId: data.antipixelId,
                tagId: data.tagId,
                userId: data.assignedById,
            },
        });
    }


    async addTagsBulk(data: Map<number, {
        antipixelId: number,
        userId: number,
    }>) {

        const res = {
            ok: new Array<{ tagId: number, antipixelId: number }>(),
            failed: new Array<{ tagId: number, antipixelId: number, reason: string }>(),
        };

        const tagsToAnti = Array.from(data.entries());
        const uniqueTagsId = tagsToAnti.map(([e,]) => e);
        const uniqueAntisId = tagsToAnti.map(([, e]) => e.antipixelId);

        // Get all existing tags
        const checkTagsIds = await this.prisma.tag.findMany({
            where: { id: { in: uniqueTagsId } },
            select: { id: true },
        }).then((res) => res.map(e => e.id));

        // Get all existing tags
        const checkAntisIds = await this.prisma.antipixel.findMany({
            where: { id: { in: uniqueAntisId } },
            select: { id: true },
        }).then((res) => res.map(e => e.id));

        // If not using Postgres, we need to check for duplicate on tag
        // const checkTagsOnAnti = await this.prisma.tagOnAntipixel.findMany({
        //     where: { antipixelId: { in: {  } } }
        // });

        const toCreate = new Array();

        // Check for non existant tag ID
        for (const [tagId, { antipixelId, userId }] of tagsToAnti) {
            if (!checkTagsIds.includes(tagId)) {
                res.failed.push({ tagId, antipixelId, reason: `Tag id ${tagId} doesn't exist!` });
                continue;
            }
            if (!checkAntisIds.includes(antipixelId)) {
                res.failed.push({ tagId, antipixelId, reason: `Antipixel id ${antipixelId} doesn't exist!` });
                continue;
            }
            toCreate.push({ tagId, antipixelId, userId });
        }

        if (toCreate.length === 0) return res;

        const created = await this.prisma.tagOnAntipixel.createManyAndReturn({
            data: toCreate,
            // skipDuplicates is not supported on MongoDB, SQLServer, or SQLite.
            // https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-multiple-records
            skipDuplicates: true,
        });

        created.forEach((e) => {
            res.ok.push({ tagId: e.tagId, antipixelId: e.antipixelId });
        });

        return res;

    }

}
