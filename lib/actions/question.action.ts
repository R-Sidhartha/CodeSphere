"use server";

import Question from "@/database/models/qustion.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/models/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();
    const { page = 1, pageSize = 10, searchQuery, filter } = params;
    const skip = (page - 1) * pageSize;
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return questions;
  } catch (error) {
    console.log("Error while fetching questions", error);
    return null;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // const question = await Question.create(params);
    // return question;
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocument = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocument.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("Error while creating question", error);
    return null;
  }
}
