import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
});
const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    `Be absolutely hilarious when answering questions!
    Question: <<<{question}>>>
    {format_instructions}`,
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});

const model = new OpenAI({ temperature: 0.9 });

const input = await prompt.format({
  question: "What is the capital of France?",
});
console.log(input);

const response = await model.call(input);
console.log("string", response);
const responseObj = await parser.parse(response);
console.log("object", responseObj);
