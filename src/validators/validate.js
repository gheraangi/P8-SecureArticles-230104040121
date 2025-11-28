export default function validate(schema) {
  return (req, res, next) => {
    const payload = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const { error } = schema.validate(payload, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      return res.status(422).json({
        success: false,
        errors: error.details.map((d) => d.message)
      });
    }

    next();
  };
}
