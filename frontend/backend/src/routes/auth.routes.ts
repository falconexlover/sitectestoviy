import express from 'express';
import { login } from '../controllers/auth.controller';

const router = express.Router();

// Маршрут для входа администратора
router.post('/login', login);

export default router; 