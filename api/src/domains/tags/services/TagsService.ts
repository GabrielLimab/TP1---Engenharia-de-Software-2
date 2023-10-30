import { prisma } from "../../../lib/prisma"
import { QueryError } from '../../../../errors/QueryError';
import { PermissionError } from "../../../../errors/PermissionError";
import { Tag } from "@prisma/client";


class TagServiceClass {
    async addTagToPicture(userId: string, pictureId: string, tag: Tag) {
        try {
            const picture = await prisma.picture.findUnique({
                where: {
                    id: pictureId
                },
            });
            if (picture) {
                if (picture.user_id !== userId) {
                    throw new PermissionError("You are not allowed to add tags to this picture");
                }
                
                const tagExists = await prisma.tag.findFirst({
                    where: {
                        name: tag.name,
                    },
                });
                if (tagExists) {
                    const pictureHasTag = await prisma.picture.findFirst({
                        where: {
                            id: pictureId,
                            tags: {
                                some: {
                                    id: tagExists.id,
                                },
                            },
                        },
                    })
                    if (pictureHasTag) {
                        throw new QueryError("Tag already exists on this picture");
                    }
                    else{
                        const newTag = await prisma.tag.update({
                            where: {
                                id: tagExists.id,
                            },
                            data: {
                                pictures: {
                                    connect: {
                                        id: pictureId,
                                    },
                                },
                            },
                            select: {
                                id: true,
                                name: true,
                                pictures: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        });
                        return newTag;
                    }
                }
                else{
                    const newTag = await prisma.tag.create({
                        data: {
                            name: tag.name,
                            pictures: {
                                connect: {
                                    id: pictureId,
                                },
                            },
                        },
                        select: {
                            id: true,
                            name: true,
                            pictures: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    });
                    return newTag;
                }
            }
            throw new QueryError("Picture not found");
        } catch (error) {
            throw error;
        }
    }

    async getTags() {
        try {
            const tags = await prisma.tag.findMany({
                orderBy: {
                    pictures: {
                        _count: "desc",
                    },
                },
                select: {
                    id: true,
                    name: true,
                    pictures: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            return tags;
        } catch (error) {
            throw error;
        }
    }

    async getTag(tag: string) {
        const existingTag = await prisma.tag.findUnique({
            where: {
                name: tag,
            },
            select: {
                id: true,
                name: true,
                pictures: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        
        if (!existingTag) {
            throw new QueryError("Tag not found");
        }

        return existingTag;
    }
}

export const TagService = new TagServiceClass();