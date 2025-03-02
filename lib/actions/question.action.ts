"use server";

import Question from "@/database/models/qustion.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/models/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/models/answer.model";
import Interaction from "@/database/models/interaction.model";
import { FilterQuery, set } from "mongoose";
import { escapeRegExp } from "../utils";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();
    const { page = 1, pageSize = 10, searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const skip = (page - 1) * pageSize;
    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skip)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skip + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log("Error while fetching questions", error);
    return null;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    // const tagDocument = [];

    // for (const tag of tags) {
    //   const existingTag = await Tag.findOneAndUpdate(
    //     {
    //       name: { $regex: new RegExp(`^${tag}$`, "i") },
    //     },
    //     { $setOnInsert: { name: tag }, $push: { questions: question._id } },
    //     { upsert: true, new: true }
    //   );

    //   tagDocument.push(existingTag._id);
    // }

    // await Question.findByIdAndUpdate(question._id, {
    //   $push: { tags: { $each: tagDocument } },
    // });

    const tagDocument = [];

    for (const tag of tags) {
      const escapedTag = escapeRegExp(tag);
      // First, check if the tag exists
      let existingTag = await Tag.findOne({
        name: { $regex: new RegExp(`^${escapedTag}$`, "i") },
      });

      if (!existingTag) {
        // Create a new tag if it doesn't exist
        existingTag = await Tag.create({
          name: tag,
          questions: [question._id],
        });
      } else {
        // If tag exists, push the question into its questions array
        await Tag.findByIdAndUpdate(existingTag._id, {
          $addToSet: { questions: question._id }, // Avoid duplicate entries
        });
      }

      tagDocument.push(existingTag._id);
    }

    // Update the question with associated tag IDs
    await Question.findByIdAndUpdate(question._id, {
      $set: { tags: tagDocument }, // Overwrite tags array instead of pushing multiple times
    });

    await Interaction.create({
      user: author,
      action: "ask-question",
      question: question._id,
      tags: tagDocument,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log("Error while creating question", error);
    return null;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({ path: "author", model: User });

    return question;
  } catch (error) {
    console.log("Error while fetching questions", error);
    throw new Error("Error while fetching questions");
  }
}
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching questions");
  }
}
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching questions");
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, path } = params;
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Error while deleting question");
  }
}
export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Error while deleting question");
  }
}
export async function getHotQuestions() {
  try {
    await connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw new Error("Error while deleting question");
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * pageSize;

    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    if (!userInteractions.length) {
      console.warn("No user interactions found for user:", user._id);
      return { questions: [], isNext: false };
    }

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const distinctUserTagIds = [
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    if (distinctUserTagIds.length === 0) {
      console.warn("User has no tag interactions, returning empty results.");
      return { questions: [], isNext: false };
    }

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } },
        { author: { $ne: user._id } },
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recomended questions", error);
    return { questions: [], isNext: false };
  }
}
