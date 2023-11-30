import { NextFunction, Request, Response } from "express";
import { User } from "../../../models";

/**
 * Signs up the user
 */
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        const existing = await User.findOne({ email });

        if (existing)
            return res.status(409).json({ error: "email already exists" });

        const user = new User({ email, password });
        await user.save();

        return res.status(201).json({
            message: "Successfully registered user",
            data: { ...user.toObject(), password: undefined },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Logs the user
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.validatePassword(password))
            return res.status(400).json({ error: "Invalid credentials" });

        req.session.user._id = user._id.toString();

        return res.status(200).json({ message: "Successfully logged user in" });
    } catch (err) {
        next(err);
    }
};