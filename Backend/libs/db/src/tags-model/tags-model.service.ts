import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
            }
        });
    };

    async getByName(name: string) {
        return await this.prisma.tag.findUnique({
            where: { name: name }
        });
    };

    async getById(id: number) {
        return await this.prisma.tag.findUnique({
            where: { id: id },
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
