import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const VerifyPassword = async (password, userPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, userPassword);

    return isMatch;
  } catch (error) {
    console.log(error);
  }
};
