"use server";

import Tag, { ITag } from "@/database/models/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/models/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/models/qustion.model";

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
export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? {
            title: { $regex: searchQuery, $options: "i" },
          }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name clerkId picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function getPopularTags() {
  try {
    await connectToDatabase();

    const PopularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return PopularTags;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
