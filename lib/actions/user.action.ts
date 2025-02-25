"use server";

import User from "@/database/models/user.model";
import { connectToDatabase } from "../mongoose";

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
