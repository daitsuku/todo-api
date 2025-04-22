import prisma from "../prisma/client";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return users;
};

export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const updateUser = async (
    userId: number,
    data: { email?: string; name?: string; password?: string }
) => {
    const updateData: any = { ...data };

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

export const deleteUser = async (userId: number) => {
    await prisma.user.delete({
        where: { id: userId },
    });

    return { success: true };
};
