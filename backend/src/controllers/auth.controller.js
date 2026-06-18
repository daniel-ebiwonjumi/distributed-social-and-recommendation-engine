import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        const { password: _, ...safeUser } = user;
        return res.status(201).json({
            message: 'User created successfully',
            user: safeUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}