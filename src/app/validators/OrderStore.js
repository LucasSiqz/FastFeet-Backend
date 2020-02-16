import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object(req.body).shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'Validation fails, body of request out of expected format!',
      messages: err.inner,
    });
  }
};
