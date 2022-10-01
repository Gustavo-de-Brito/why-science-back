import { Router } from 'express';
import { registerUser } from '../controllers/authController';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import signUpSchema from '../schemas/signUpSchema';

const authRouter: Router = Router();

authRouter.post('/sign-up', schemaValidation(signUpSchema), registerUser);

export default authRouter;