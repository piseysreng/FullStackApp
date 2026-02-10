import { Request, Response } from "express";
import { db } from '../../db/index.js';
import { eq, like } from "drizzle-orm";
import fs from 'fs';
import path from "path";

export async function singleUpload(req: Request, res: Response) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Validate File Format
        if (!allowedTypes.includes(req.file?.mimetype)) {
            return res.status(400).json({
                error: "File must be a JPEG, JPG, or PNG image"
            });
        }

        // Check and Create Directory
        const dir = 'upload';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Build the file name
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;

        // Save the file to directory
        fs.writeFileSync(dir + '/' + filename, req.file.buffer);

        // const data = req.file;
        res.status(200).json(filename);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function multipleUpload(req: Request, res: Response) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const dir = 'upload';

    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // --- STEP 1: PRE-VALIDATION LOOP ---
        // We check all files FIRST. If one is bad, we return early.
        for (const file of files) {
            if (!(allowedTypes as string[]).includes(file.mimetype)) {
                return res.status(400).json({
                    error: `Validation failed: "${file.originalname}" is not a valid format. No files were uploaded.`
                });
            }
        }

        // --- STEP 2: DIRECTORY CHECK ---
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // --- STEP 3: UPLOAD LOOP ---
        // Because we validated everything in Step 1, we know it's safe to upload now.
        const savedFiles = files.map(file => {
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            const filePath = path.join(dir, filename);

            fs.writeFileSync(filePath, file.buffer);
            return filename;
        });

        return res.status(200).json({ 
            message: "All files uploaded successfully",
            files: savedFiles 
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}