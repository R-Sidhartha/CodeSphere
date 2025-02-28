"use server";

import Question from "@/database/models/qustion.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/models/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        return console.log("user already this question");
      }
      await Interaction.create({
        user: userId,
        action: "view",
        questionId: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
