import { config } from "dotenv";
config();

import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const llm = new OpenAI({ temperature: 0.5 });
const template = `You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
 
  Title: <<<{title}>>>
  Playwright: This is a synopsis for the above play:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

const reviewTemplate = `You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.
 
  Play Synopsis:
  <<<{synopsis}>>>
  Review from a New York Times play critic of the above play:`;
const reviewPromptTemplate = new PromptTemplate({
  template: reviewTemplate,
  inputVariables: ["synopsis"],
});
const reviewChain = new LLMChain({ llm, prompt: reviewPromptTemplate });

const overallChain = new SimpleSequentialChain({
  chains: [synopsisChain, reviewChain],
  verbose: true,
});
const review = await overallChain.run("Tragedy at sunset on the Moon");

console.log(review);