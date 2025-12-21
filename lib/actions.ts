"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "./client";
import z, { success } from "zod";
import { error } from "console";
import { tr } from "zod/v4/locales";
import { revalidatePath } from "next/cache";

export const switchFollow = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) throw new Error("User is not authenticated !");

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId
            }
        });

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id
                }
            })
        } else {
            const existingFollowReq = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    recieverId: userId
                }
            });

            if (existingFollowReq) {
                await prisma.followRequest.delete({
                    where: {
                        id: existingFollowReq.id
                    }
                })
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        recieverId: userId
                    }
                });
            }
        }
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went Wrong !")
    }
}

export const switchBlock = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) throw new Error("User is not authenticated !");

    try {
        const existingBlock = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: userId
            }
        });
        console.log('existingBlock', existingBlock);

        if (existingBlock) {
            await prisma.block.delete({
                where: {
                    id: existingBlock.id
                }
            })
        } else {
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId
                }
            });
        }
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went Wrong !")
    }
}

export const acceptReq = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) throw new Error("User is not authenticated !");

    try {
        const existingFollowReq = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                recieverId: currentUserId
            }
        });

        if (existingFollowReq) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowReq.id
                }
            })

            await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: currentUserId
                }
            });
        }
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong !");
    }

}

export const rejectReq = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) throw new Error("User is not authenticated !");

    try {
        const existingFollowReq = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                recieverId: currentUserId
            }
        });

        if (existingFollowReq) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowReq.id
                }
            });
        }
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong !");
    }
}

export const updateUserData = async (prevState: { success: boolean, error: boolean }, payload: { formdata: FormData, cover: string }) => {
    const { formdata, cover } = payload;
    const fields = Object.fromEntries(formdata);
    console.log('fields', fields);

    const filteredFields = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value !== ''))

    const Profile = z.object({
        cover: z.string().optional(),
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        description: z.string().max(255).optional(),
        city: z.string().max(60).optional(),
        work: z.string().max(60).optional(),
        website: z.string().max(60).optional(),
        school: z.string().max(60).optional(),
    });

    const validateFields = Profile.safeParse({ cover, ...filteredFields });
    if (!validateFields.success) {
        console.log('Error', validateFields.error.flatten().fieldErrors);
        return { success: false, error: true };
    }

    const { userId: currentUserId } = await auth();
    if (!currentUserId) return { success: false, error: true };;

    try {
        await prisma.user.update({
            where: {
                id: currentUserId
            },
            data: validateFields.data
        })

        return { success: true, error: false }
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong!")
        return { success: false, error: true };
    }
}

export const switchLike = async (postId: string, postCreatorId: string, username: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("User is not Authenticated!");

    const descgen = `${username !== "" ? username : "Someone"} has liked your Post.`

    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                postId, userId
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            })
        } else {
            await prisma.like.create({
                data: {
                    userId,
                    postId
                }
            });

            await prisma.notifications.create({
                data: {
                    userId: postCreatorId,
                    postId,
                    createdAt: new Date(Date.now()),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    desc: descgen
                }
            })
        }
        revalidatePath("/");
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong!")
    }
}

export const addComment = async (postId: string, desc: string, username: string, postCreatorId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("User is not Authenticated!");

    const descGen = `${username !== "" ? username : "Someone"} has added a new comment on the Post with title ${desc}`

    try {
        const commentCreated = await prisma.comment.create({
            data: {
                postId,
                desc,
                userId
            },
            include: {
                user: true
            }
        });

        await prisma.notifications.create({
            data: {
                userId: postCreatorId,
                postId,
                createdAt: new Date(Date.now()),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                desc: descGen
            }
        })

        revalidatePath("/")
        return commentCreated;
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong!");
    }
}

export const addPost = async (formdata: FormData, img: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("User is not Authenticated!");

    const Desc = z.string().min(1).max(255);
    const desc = formdata.get("desc") as string;
    const validateFields = Desc.safeParse(desc);
    if (!validateFields.success) {
        throw new Error("Description is required.");
        return;
    }

    try {
        await prisma.post.create({
            data: {
                desc: validateFields.data,
                userId,
                image: img,
            }
        });

        revalidatePath("/");
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong!");
    }
}

export const addStory = async (img: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("User is not Authenticated!");

    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId
            }
        });

        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id
                }
            });
            revalidatePath("/");
        }

        const createdStory = await prisma.story.create({
            data: {
                img,
                userId,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            },
            include: {
                user: true
            }
        })

        return createdStory;
    } catch (error) {
        console.log('error', error);
        throw new Error("Something went wrong!");
    }
}

export const deletePost = async (postId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("User is not Authenticated!");

    try {
        await prisma.$transaction([
            prisma.notifications.deleteMany({
                where: { postId },
            }),

            prisma.like.deleteMany({
                where: {
                    postId,
                },
            }),

            prisma.comment.deleteMany({
                where: { postId },
            }),

            prisma.post.delete({
                where: {
                    id: postId,
                    userId,
                },
            }),
        ]);

        revalidatePath("/");
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong!");
    }
};

export async function markNotificationsAsRead() {
    const { userId } = await auth();
    if (!userId) return;

    await prisma.notifications.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
}

