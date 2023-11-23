import { VerifyPassword, hashPassword } from "../helpers/authHelper.js";
import { clientError, serverError } from "../helpers/handleErrors.js";
import userModel from "../models/userModel.js";

export const registerUserController = async (req, res) => {
  try {
    const { username, email, password, answer } = req.body;

    if (!username) {
      return clientError(res, "Username required!");
    }
    if (!email) {
      return clientError(res, "Email required!");
    }
    if (!answer) {
      return clientError(res, "answer required!");
    }
    if (!password) {
      return clientError(res, "Password required!");
    }

    const hashedPassword = await hashPassword(password);

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return clientError(res, "Email already used! try another");
    }

    const newUser = await new userModel({
      ...req.body,
      password: hashedPassword,
    }).save();

    newUser.password = "******";

    return res.status(200).send(newUser);
  } catch (error) {
    return serverError(res, error, "Error Registering New User!");
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email) {
      return clientError(res, "Invalid username or email!");
    }
    if (!password) {
      return clientError(res, "Invalid Password!");
    }

    const args = { $or: [{ username: username }, { email: email }] };

    const user = await userModel.findOne(args);
    if (!user) {
      return clientError(res, "No user found with this email or username!");
    }

    const isPasswordMatch = await VerifyPassword(password, user.password);

    if (!isPasswordMatch) {
      return clientError(res, "Wrong Password! try again");
    }

    user.password = "******";
    return res.status(200).send(user);
  } catch (error) {
    return serverError(res, error, "Error While trying log in!");
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, answer, password } = req.body;

    if (!email || !answer) return clientError(res, "Invalid email or answer!");
    if (!password) return clientError(res, "Invalid password!");

    const hashedPassword = await hashPassword(password);

    const user = await userModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return clientError(res, `No user with ${email}`);
    }

    user.password = "******";

    return res.status(200).send(user);
  } catch (error) {
    return serverError(rs, error, "Error While reset password!");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();

    return res.status(200).send(allUsers);
  } catch (error) {
    return serverError(res, error, "Error while fetching all users!");
  }
};
