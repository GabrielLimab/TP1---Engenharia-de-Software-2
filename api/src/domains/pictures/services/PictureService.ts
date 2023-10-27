import { prisma } from "../../../lib/prisma"
import { QueryError } from '../../../../errors/QueryError';

class PictureServiceClass {
    async uploadPicture(userId:string, file: any, tag: string) {
        const pictureTag = await prisma.tag.findUnique({
            where: {
                name: tag,
            },
        });

        if (!pictureTag) {
            console.log('Created');
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

    async getPicture(id: string) {
        const picture = await prisma.picture.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                picture_url: true,
                user: {
                    select: {
                        id: true,
                    },
                },
                likes: {
                    select: {
                        id: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!picture) {
            throw new QueryError('Picture not found');
        }
        
        return picture;
    }

    async toggleLike(userId: string, id: string) {
        const picture = await this.getPicture(id);

        if (!picture) {
            throw new QueryError('Picture not found');
        }

        if (picture.likes.some((like) => like.id === userId)) {
            await prisma.picture.update({
                where: {
                    id: id,
                },
                data: {
                    likes: {
                        disconnect: {
                            id: userId,
                        },
                    },
                },
            });
        } else {
            await prisma.picture.update({
                where: {
                    id: id,
                },
                data: {
                    likes: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        }
    }

    async getTopPictures() {
        const pictures = await prisma.picture.findMany({
            where: {
                created_at: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                profile_picture: false,
            },
            orderBy: {
                likes: {
                    _count: 'desc',
                }
            },
            select: {
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
                likes: true,
                tags: true,
                picture_url: true,
            }
        });

        return pictures;
    }

    async getPicturesByTag(tag: string) {
        let pictures;
        if (tag === '') {
            pictures = await prisma.picture.findMany({
                where: {
                    profile_picture: false,
                    tags: {
                        none: {},
                    },
                },

                select: {
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
                },
            });

        } else {
            pictures = await prisma.picture.findMany({
                where: {
                    profile_picture: false,
                    tags: {
                        some: {
                            name: tag,
                        },
                    },
                },
                select: {
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
                },
            });
        }   

        return pictures;
    }

    async getPicturesByUserID(userId: string) {
        const pictures = await prisma.picture.findMany({
            where: {
                user_id: userId,
                profile_picture: false,
            },
            select: {
                id: true,
                user_id: true,
                picture_url: true,
                profile_picture: true,
                likes: true,
                tags: true, 
                created_at: true,
            }
        });
        if(!pictures) {
            throw new QueryError('No pictures found');
        }

        return pictures;
    }

    async getAllPictures() {
        const pictures = await prisma.picture.findMany({
            where: {
                profile_picture: false,
            },

            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        picture: {
                            where: {
                                profile_picture: true,
                            },
                        },
                    },
                },
                likes: {
                    select: {
                        id: true,
                    }
                },
                tags: true,
                picture_url: true,
            },
        });

        return pictures;
    }

    async getFollowingPictures(userId: string) {
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
            select: {
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
                likes: true,
                tags: true,
                picture_url: true,
            }
        });
        
        if(!pictures) {
            throw new QueryError('No pictures found');
        }
        
        return pictures;
    }
}

export const PictureService = new PictureServiceClass();