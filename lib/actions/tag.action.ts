"use server";

import Tag from "@/database/models/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/models/user.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();

    const { userId, limit = 3 } = params;

    const users = await User.findById(userId);

    if (!users) {
      throw new Error("User not found");
    }

    // const userTags = users.tags;

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag1" },
      { _id: "3", name: "tag3" },
    ];

    //   return users;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();

    const tags = await Tag.find({});

    return tags;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
