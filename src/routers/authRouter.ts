import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import signUpSchema from '../schemas/signUpSchema';
import signInSchema from '../schemas/signInSchema';

const authRouter: Router = Router();

authRouter.post('/sign-up', schemaValidation(signUpSchema), registerUser);
authRouter.post('/sign-in', schemaValidation(signInSchema), loginUser);

export default authRouter;