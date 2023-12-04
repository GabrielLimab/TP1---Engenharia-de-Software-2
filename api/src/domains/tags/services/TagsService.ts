import { QueryError } from '../../../../errors/QueryError';
import { PermissionError } from "../../../../errors/PermissionError";
import prisma from "../../../libs/prisma"

class TagServiceClass {
    selectOptions = {
        id: true,
        name: true,
        pictures: {
            select: {
                id: true,
            },
        },
    };

    async addToPicture(userId: string, pictureId: string, tagname: string) {
        const picture = await prisma.picture.findUnique({
            where: {
                id: pictureId
            },
            select: {
                id: true,
                user_id: true,
                tags: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
          });
          
          if (!picture) {   
            throw new QueryError("Picture not found");
          }
          
          if (picture.user_id !== userId) {
            throw new PermissionError("You are not allowed to add tags to this picture");
          }
          
          const tagAlreadyExistsOnPicture = picture.tags.some((pictureTag) => pictureTag.name === tagname);
          
          if (tagAlreadyExistsOnPicture) {
            throw new QueryError("Tag already exists on this picture");
          }
          
          await prisma.tag.upsert({
            where: {
                name: tagname,
            },
            create: {
                name: tagname,
                pictures: {
                    connect: {
                        id: pictureId,
                    },
                },
            },
            update: {
                pictures: {
                    connect: {
                        id: pictureId,
                    },
                },
            },
        });
    }

    async getAll() {
        const tags = await prisma.tag.findMany({
            orderBy: {
                pictures: {
                    _count: "desc",
                },
            },
            select: this.selectOptions,
        });
        
        return tags;
    }

    async getByTagname(tag: string) {
        const existingTag = await prisma.tag.findUnique({
            where: {
                name: tag,
            },
            select: this.selectOptions,
        });
        
        if (!existingTag) {
            throw new QueryError("Tag not found");
        }

        return existingTag;
    }
}

export const TagService = new TagServiceClass();