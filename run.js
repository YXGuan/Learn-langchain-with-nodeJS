// server.js

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const { PromptTemplate } = require("langchain/prompts");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { createClient } = require("@supabase/supabase-js");

const fs = require("fs").promises;

async function readFileAsync(filePath) {
  try {
    // Read the contents of the file asynchronously
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

// import data from a file relative to current file
// import data from "./scrimba-info.txt";
async function ReadFileFunction() {
  console.log("data from file");
  fs.readFile("scrimba-info.txt", (err, data) => {
    // if (err) throw err;
    console.log(data.toString());
    const result = data.toString();
    console.log(result);
    return data.toString();
  });
}

// console.log(result);

async function someFunction() {
  // Requiring fs module in which
  // readFile function is defined.
  // console.log("before await");
  // const result = await ReadFileFunction();
  // console.log("after await", result);
  // Call the async function
  // readFileAsync("scrimba-info.txt")
  //   .then((fileContent) => {
  //     console.log("File content:", fileContent);
  //     console.log("File reading completed.");
  //   })
  //   .catch((error) => {
  //     console.error("File reading failed:", error);
  //   });
  const result = await readFileAsync("lift_info.txt");
  console.log("after await", result);

  // const result = await fetch("scrimba-info.txt");
  // const text = await result.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50, // 10 % overlap
    seperator: ["\n\n", "\n", " ", ""], // seperate by new lines
  });
  const output = await splitter.createDocuments([result]); // this used to be text

  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbURL = process.env.SUPABASE_URL_LC_CHATBOT;
  const openiakeyapi = process.env.OPENAI_API_KEY;

  const client = createClient(sbURL, sbApiKey);

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openiakeyapi }),
    {
      client: client,
      tableName: "liftdocs",
    },
  );
}

// @supabase/supabase-js
try {
  someFunction();
} catch (err) {
  console.log(err);
}

// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();
// const port = 3000;

// Définissez une route API
// app.get('/api/question', async (req, res) => {
//     const question = req.query.question;
//     // openia api key
//     const openiakeyapi = process.env.OPENAI_API_KEY;
//     // embeddings
//     const embeddings = new OpenAIEmbeddings({ openiakeyapi });
//     // supabase info
//     const sbApiKey = process.env.SUPABASE_API_KEY;
//     const sbURL = process.env.SUPABASE_URL_LC_CHATBOT;
//     const client = createClient(sbURL,sbApiKey);
//     // llm
//     const llm = new ChatOpenAI({ openiakeyapi });
//     // standalone question
//     const standaloneQuestion = `Given a question, convert it to a standalone question. question: {question}`;
//     // question promp
//     const standaloneQuestionPromp = PromptTemplate.fromTemplate( standaloneQuestion );
//     // chain using pipe
//     const standaloneQuestionChain = standaloneQuestionPromp.pipe(llm);
//     // invoke
//     const responseia = await standaloneQuestionChain.invoke({question});

//     return res.js   on(responseia.content);

// });

// Démarrer le serveur
// app.listen(port, () => {
//  console.log(`Serveur démarré sur le port ${port}`);
// });
