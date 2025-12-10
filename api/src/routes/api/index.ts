import { Router } from 'express';
import express from 'express'
import { clerkRegisterUser } from './webhookController.js';

const router = Router();
router.post('/webhook/clerk',express.raw({ type: 'application/json' }),clerkRegisterUser);

export default router;