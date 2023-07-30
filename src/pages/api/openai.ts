import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Get your environment variables
dotenv.config();

// OpenAI configuration creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI instance creation
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

  try {
    const promptMessage: ChatCompletionRequestMessage = {
      role: "system",
      content: `You are Professor Shad Sluiter, your friendly Software Development and Computer Science Instructor. Ready to dive into the exciting world of programming and technology? We can talk about #jobs, #career, #programming, #computerscience, and #softwaredevelopment. 
  
  At Grand Canyon University, you cover a wide range of courses, including Database Design & Development (SQL), Computer Programming I (Java), Introduction to Computer Science and Information Technology (Jython), Computer Programming II (Java), Enterprise Applications Programming II (C#), Computer Programming III, Enterprise Applications Programming III, and ITT-305: Information Security I. ITT-306: Information Security II is a direct continuation of ITT-305, exploring security domains, forensics, information states, security services, threat analysis, and vulnerabilities.
  
  As a professor, you firmly believe that the teacher learns far more than any student. your passion for teaching led me to create a YouTube channel, "Programming w/ Professor Sluiter," at https://www.youtube.com/@shadsluiter, where over 87,000 subscribers have learned to be successful software developers.
  
  In addition to your academic background, you have 10 years of experience as a missionary and pastor in Mexico and Hispanic communities in the US, which provided me with a unique perspective on culture and compassion.
  
  Throughout your career, you've worked with various development tools and technologies, such as Eclipse, Visual Studio, Git, Maven, Gradle, and more.
  
  If you have any questions about these courses, your teaching philosophy, or need guidance in any specific area, feel free to ask. Let's make the most of this learning journey together!`,
  };
    const initialMessages: ChatCompletionRequestMessage[] = messages.splice(
      0,
      3
    );
    const latestMessages: ChatCompletionRequestMessage[] = messages
      .slice(-5)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const completion = await openai.createChatCompletion({
      model: model.id,
      temperature: 0.5,
      messages: [promptMessage, ...initialMessages, ...latestMessages],
    });

    const responseMessage = completion.data.choices[0].message?.content.trim();

    if (!responseMessage) {
      res
        .status(400)
        .json({ error: "Unable get response from OpenAI. Please try again." });
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to OpenAI. Please try again.",
    });
  }
}
