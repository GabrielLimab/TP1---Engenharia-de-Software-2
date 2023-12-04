import { QueryError } from '../../../../errors/QueryError';
import prisma from "../../../libs/prisma"

class PictureServiceClass {
    selectOptions = {
        id: true,
        user: {
            select: {
                id: true,
                username: true,
                picture: {
                    where: {
                        profile_picture: true,
                    },
                }
            },
        },
        likes: {
            select: {
                id: true,
            }
        },
        tags: true,
        picture_url: true,
    }

    async create(userId:string, file: any, tag: string) {
        const pictureTag = await prisma.tag.findUnique({
            where: {
                name: tag,
            },
        });

        if (!pictureTag) {
            await prisma.tag.create({
                data: {
                    name: tag,
                },
            });
        }

        await prisma.picture.create({
            data: {
                picture_url: file.filename,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                tags: {
                    connect: {
                        name: tag,
                    },
                },
            },
        });
    }

    async getById(id: string) {
        const picture = await prisma.picture.findUnique({
            where: {
                id: id,
            },
            select: this.selectOptions,
        });

        if (!picture) {
            throw new QueryError('Picture not found');
        }
        
        return picture;
    }

    async getTop() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pictures = await prisma.picture.findMany({
            where: {
                created_at: {
                    gte: oneDayAgo,
                },
                profile_picture: false,
            },
            orderBy: {
                likes: {
                    _count: 'desc',
                }
            },
            select: this.selectOptions,
        });

        return pictures;
    }

    async getByTagname(tagname: string) {
        let pictures;
        
        pictures = await prisma.picture.findMany({
            where: {
                profile_picture: false,
                tags: {
                    some: {
                        name: tagname,
                    },
                },
            },
            select: this.selectOptions,
        });

        return pictures;
    }

    async getByUserId(userId: string) {
        const pictures = await prisma.picture.findMany({
            where: {
                user_id: userId,
                profile_picture: false,
            },
            select: this.selectOptions,
        });
        if(!pictures) {
            throw new QueryError('No pictures found');
        }

        return pictures;
    }

    async getAll() {
        const pictures = await prisma.picture.findMany({
            where: {
                profile_picture: false,
            },
            select: this.selectOptions,
        });

        return pictures;
    }

    async getFollowing(userId: string) {
        const pictures = await prisma.picture.findMany({
            where: {
                user: {
                    followed_by: {
                        some: {
                            id: userId,
                        },
                    },
                },
                profile_picture: false,
            },
            orderBy: {
                created_at: 'desc',
            },
            select: this.selectOptions,
        });
        
        if(!pictures) {
            throw new QueryError('No pictures found');
        }
        
        return pictures;
    }

    async toggleLike(userId: string, id: string) {
        const picture = await this.getById(id);

        if (!picture) {
            throw new QueryError('Picture not found');
        }

        let key;
        const isLiked = picture.likes.some((like) => like.id === userId);

        if (isLiked) {
            key = 'disconnect';
        } else {
            key = 'connect';
        }

        await prisma.picture.update({
            where: {
                id: id,
            },
            data: {
                likes: {
                    [key]: {
                        id: userId,
                    },
                },
            },
        });
    }
}

export const PictureService = new PictureServiceClass();