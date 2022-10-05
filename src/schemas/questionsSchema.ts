import joi from 'joi';

const questionsSchema = joi.object(
  {
    title: joi.string().required(),
    categoryId: joi.number().integer(),
    newCategoryName: joi.string().max(30)
  }
);

export default questionsSchema;