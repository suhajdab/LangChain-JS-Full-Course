import { config } from "dotenv";
config();

import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const llm = new OpenAI({ temperature: 0.5 });

let template =
  `Restaurant order: <<<{dish_name}>>>
   Experience: <<<{experience}>>> 
   
   Write a review:`;
let promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["dish_name", "experience"],
});
const reviewChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "review",
});

template = "Given this restaurant review: <<<{review}>>>, write a kind response from the staff:";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const commentChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "comment",
});

template = "Given this review: <<<{review}>>>, summarize in one short sentence:";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const summaryChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "summary",
});

template = "Translate the summary to Swedish: <<<{summary}>>>";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["summary"],
});
const translationChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "swedish_translation",
});

const overallChain = new SequentialChain({
  chains: [reviewChain, commentChain, summaryChain, translationChain],
  inputVariables: ["dish_name", "experience"],
  outputVariables: ["review", "comment", "summary", "swedish_translation"],
});

const result = await overallChain.call({
  dish_name: "Pizza Salami, Light beer",
  experience: "Pizza burnt, beer warm, toilet dirty and smelly, service slow, but at least friendly.",
});
console.log(result);
