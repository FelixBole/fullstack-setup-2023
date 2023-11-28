import { NextFunction, Request, Response } from "express";
import { User } from "../../../models";
import { UserMongooseUtils } from "../../../libs/mongoose/users.mongoose";

/**
 * Gets the user in session
 */
export const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.session.user._id)
            .select(UserMongooseUtils.publicSelect)
            .lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        return user;
    } catch (err) {
        next(err);
    }
};

/**
 * Updates a user by ID
 */
export const updateUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { ...req.body },
            { new: true, runValidators: true }
        )
            .select(UserMongooseUtils.publicSelect)
            .lean();

        return res.json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes a user by ID
 */
export const deleteUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId).select(
            UserMongooseUtils.publicSelect
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    } catch (err) {
        next(err);
    }
};
