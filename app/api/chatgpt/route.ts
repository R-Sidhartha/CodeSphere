import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { questionTitle, questionContent } = await request.json();

    if (!questionTitle || !questionContent) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_APIKEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a highly intelligent assistant that provides the best and most effective information for coding and programming questions.",
          },
          {
            role: "user",
            content: `Question Title: ${questionTitle}\n\nQuestion Content: ${questionContent}`,
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.error?.message || "Failed to fetch AI response"
      );
    }

    const reply =
      responseData.choices?.[0]?.message?.content || "No response from AI.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
};
