// importing packages
import express from 'express';

// import controller
import UserController from './controller';

// import parser
import parser from '../lib/parser';

const router = express.Router();

router.post('/', parser(UserController, 'login'));
router.post('/forgot-password', parser(UserController, 'forgot'));
router.put('/reset-password', parser(UserController, 'reset'));
router.post('/sendgrid', parser(UserController, 'sendgrid'));

export default router;
