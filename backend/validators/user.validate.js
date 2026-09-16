import yup from "yup";

// This code act as a middleware for user data (i checks the data coming from req.body is in correct format before contollers runs)
export const userSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be atleast of 3 characters")
    .required(),
  email: yup.string().email("The email not valid ").required(),

  password: yup
    .string()
    .min(4, "Password must be atleast 4 character")
    .required(),
});

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      errors: err.errors,
    });
  }
};
