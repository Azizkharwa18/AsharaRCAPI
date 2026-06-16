import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import config from '../utils/config.js';

export const authenticateUser = (req, res, next) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, config.jwt.secret);
        if (id && id != payload.user_id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token invalid' });
        }
        req.user = { userId: payload.user_id, name: payload.name };
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }
};