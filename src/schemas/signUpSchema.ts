import joi from 'joi';

const signUpSchema = joi.object(
  {
    name: joi.string().required(),
    email: joi.string().email().required(),
    imageUrl: joi.string().uri().required(),
    password: joi.string().required(),
    confirmPassword: joi
      .string()
      .valid(joi.ref('password'))
      .required()
      .label('as senhas não são iguais')
  }
);

export default signUpSchema;