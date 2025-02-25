"use server";

import User from "@/database/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/qustion.model";

export async function getUserById(params: any) {
  try {
    // const user = await User.findById(params.id);
    // return user;
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);

    return newUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user his questions, answers, comments and everything related to him from the database
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findOneAndDelete(user._id);

    // revalidatePath(path);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
