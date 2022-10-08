import joi from 'joi';

const answerSchema = joi.object(
  {
    text: joi.string().required()
  }
);

export default answerSchema;