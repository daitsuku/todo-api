import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();

    console.log("Database cleared");

    // Create users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const admin = await prisma.user.create({
        data: {
            email: "admin@example.com",
            name: "Admin User",
            password: adminPassword,
        },
    });

    const user = await prisma.user.create({
        data: {
            email: "user@example.com",
            name: "Regular User",
            password: userPassword,
        },
    });

    console.log("Users created");

    // Create tasks
    const task1 = await prisma.task.create({
        data: {
            title: "Complete API Development",
            description: "Finish the task management API with authentication",
            status: "in-progress",
            userId: admin.id,
        },
    });

    const task2 = await prisma.task.create({
        data: {
            title: "Write Documentation",
            description: "Create comprehensive API documentation",
            status: "pending",
            userId: admin.id,
        },
    });

    const task3 = await prisma.task.create({
        data: {
            title: "Test the API",
            description: "Perform thorough testing of all endpoints",
            status: "pending",
            userId: user.id,
        },
    });

    console.log("Tasks created");

    // Create comments
    await prisma.comment.create({
        data: {
            taskId: task1.id,
            userId: admin.id,
            comment: "Making good progress on this task",
        },
    });

    await prisma.comment.create({
        data: {
            taskId: task1.id,
            userId: user.id,
            comment: "Let me know if you need any help",
        },
    });

    await prisma.comment.create({
        data: {
            taskId: task2.id,
            userId: admin.id,
            comment: "Will start this soon",
        },
    });

    console.log("Comments created");

    console.log("Database seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
