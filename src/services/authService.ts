import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import environment from "../config/environment";

export const registerUser = async (
    email: string,
    password: string,
    name?: string
) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    // Remove password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = (jwt as any).sign(
        { userId: user.id },
        environment.JWT_SECRET,
        {
            expiresIn: environment.TOKEN_EXPIRY,
        }
    );

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours from now

    // Save token in database
    await prisma.token.upsert({
        where: { userId: user.id },
        update: {
            token,
            expiresAt: expiryDate,
        },
        create: {
            userId: user.id,
            token,
            expiresAt: expiryDate,
        },
    });

    return { token, userId: user.id };
};

export const logoutUser = async (userId: number) => {
    await prisma.token
        .delete({
            where: { userId },
        })
        .catch(() => {
            // If token doesn't exist, ignore the error
        });

    return { success: true };
};

export const getTokenByUserId = async (userId: number) => {
    const tokenRecord = await prisma.token.findUnique({
        where: { userId },
        select: {
            id: true,
            token: true,
            userId: true,
            createdAt: true,
            expiresAt: true,
        },
    });

    if (!tokenRecord) {
        throw new Error("Token not found");
    }

    return tokenRecord;
};
