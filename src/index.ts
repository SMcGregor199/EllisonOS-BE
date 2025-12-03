import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const client = new OpenAI();

function load(file: string) {
  return fs.readFileSync(path.join(process.cwd(), "instructions", file), "utf8");
}

const systemPrompt = load("ellison-system-prompt.md");
const samplePrompts = load("ellison-sample-prompts.md");
const citations = load("ellison.citations.md");
const tags = load("ellison-tags.md");
const excerpts = load("ellison-excepts.md");

export async function askTheEllisonScholar(userMessage: string) {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "system",
        content: `# Curated Excerpts\n\n${excerpts}`
      },
      {
        role: "system",
        content: `# Citation Index\n\n${citations}`
      },
      {
        role: "system",
        content: `# Thematic Tags\n\n${tags}`
      },
      {
        role: "system",
        content: `# Behavioral Prompt Examples\n\n${samplePrompts}`
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  });

  return response.output_text;
}


askTheEllisonScholar("What does Ellison mean by invisibility?").then((response) => console.log(response));