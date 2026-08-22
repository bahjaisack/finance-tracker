export const validate = (Schema) => (req, res, next) => {
  const result = Schema.safeParse(req.body);

  if (!result.success) {
    const formatted = result.error.format();

    const errorList = Object.keys(formatted)
      .filter((field) => field !== "_errors")
      .map((field) => ({
        field,
        message: formatted[field]?._errors?.[0] || "Invalid input",
      }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorList,
    });
  }

  req.body = result.data;

  next();
};