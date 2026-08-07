import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { overridePrismaFilter } from '../prisma/prisma.filter';
import { CreateTagDuplicateException } from 'src/tags/dto/create-tag.dto';

@Injectable()
export class TagsModelService {

    private readonly logger = new Logger(TagsModelService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: {
        userId: number,
        userName: string,
        tagName: string,
        tagDescription: string,
    }) {
        return await this.prisma.tag.create({
            data: {
                name: data.tagName,
                description: data.tagDescription,
                createdBy: { connect: { id: data.userId } },
                status: 'PENDING',
                statusHistory: {
                    create: {
                        reason: `${data.userName} submitted new tag`,
                        status: 'PENDING',
                        changeMadeBy: { connect: { id: data.userId } },
                    },
                },
            },
            include: {
                createdBy: { select: { id: true, userName: true } }
            }
        }).catch((e) =>
            overridePrismaFilter(e, (err) => {
                if (err.code === 'P2002') {
                    this.logger.debug(`Tag ${data.tagName} already exist`);
                    throw new CreateTagDuplicateException({ duplicateOfName: data.tagName });
                }
                throw e;
            })
        );
    };

    private defaultGetLimit = 50;

    async getAll(offset?: number, limit: number = this.defaultGetLimit) {
        let cursor = offset ? { id: offset } : undefined;
        let skip = offset ? 1 : 0;
        return await this.prisma.tag.findMany({
            include: {
                createdBy: { select: { id: true, userName: true } }
            },
            take: limit,
            skip: skip,
            cursor: cursor,
            orderBy: {
                id: "asc",
            }
        });
    }

    async getByName(name: string) {
        return await this.prisma.tag.findUnique({
            where: { name: name },
            include: {
                createdBy: { select: { id: true, userName: true } }
            },
        });
    };

    async getById(id: number) {
        return await this.prisma.tag.findUnique({
            where: { id: id },
            include: {
                createdBy: { select: { id: true, userName: true } }
            },
        });
    };

    async assignToAntiId(data: {
        tagName?: string,
        tagId?: number,
        assingedByUserId: number,
        assignedByuserName: string,
        antipixelId: number,
    }) {
        return await this.prisma.tagOnAntipixel.create({
            data: {
                tag: { connect: { id: data.tagId, name: data.tagName } },
                antipixel: { connect: { id: data.antipixelId } },
                assignedBy: { connect: { id: data.assingedByUserId } },
            }
        });
    };
}
