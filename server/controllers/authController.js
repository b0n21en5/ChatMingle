import mongoose from "mongoose";
import { VerifyPassword, hashPassword } from "../helpers/authHelper.js";
import { clientError, serverError } from "../helpers/handleErrors.js";
import userModel from "../models/userModel.js";
import fs from "fs";

export const registerUserController = async (req, res) => {
  try {
    const { username, email, password, answer } = req.fields;
    const { profileImg } = req.files;

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

    if (profileImg.size > 1000000) {
      return clientError(res, "Photo size must be less than 1 mb!");
    }

    const hashedPassword = await hashPassword(password);

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return clientError(res, "Email already used! try another");
    }

    const newUser = await new userModel({
      ...req.fields,
      password: hashedPassword,
    });

    if (profileImg) {
      newUser.profileImg.data = fs.readFileSync(profileImg.path);
      newUser.profileImg.contentType = profileImg.type;
    }

    await newUser.save();

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

export const getProfileImage = async (req, res) => {
  try {
    const { profileImg } = await userModel.findById(req.params.uid);

    res.contentType(profileImg.contentType);

    return res.status(200).send(profileImg.data);
  } catch (error) {
    return serverError(res, error, "Error while fetching profile image!");
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
    let allUsers = await userModel.find();

    const userId = req.query.uid;
    if (userId) {
      allUsers = allUsers.filter(
        (user) => !user._id.equals(new mongoose.Types.ObjectId(userId))
      );
    }

    return res.status(200).send(allUsers);
  } catch (error) {
    return serverError(res, error, "Error while fetching all users!");
  }
};

export const searchUserController = async (req, res) => {
  try {
    let keyword = req.params.searchQry;
    keyword = keyword.toLowerCase();

    const users = await userModel.find({
      username: { $regex: keyword, $options: "i" },
    });

    return res.status(200).send(users);
  } catch (error) {
    return serverError(res, error, "Error while searching user!");
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { email, password } = req.fields;
    const { profileImg } = req.files;

    if (!email) {
      return clientError(res, "Email required!");
    }
    if (!password) {
      return clientError(res, "Password required!");
    }

    if (profileImg.size > 1000000) {
      return clientError(res, "Image size must be less than 1 mb!");
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      {
        ...req.fields,
        password: hashedPassword,
      },
      { new: true }
    );

    if (profileImg) {
      updatedUser.profileImg.data = fs.readFileSync(profileImg.path);
      updatedUser.profileImg.contentType = profileImg.type;
    }

    await updatedUser.save();

    updatedUser.password = "******";

    return res.status(200).send(updatedUser);
  } catch (error) {
    return serverError(res, error, "Error Registering New User!");
  }
};
