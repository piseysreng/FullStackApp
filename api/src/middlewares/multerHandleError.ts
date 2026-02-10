import { NextFunction, Request, Response } from "express";
import multer from 'multer';

export const multerHandleError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: "File too large. Max limit is 1MB." });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: "Too many files uploaded. Max limit is 2." });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: "Too many files uploaded." });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
};