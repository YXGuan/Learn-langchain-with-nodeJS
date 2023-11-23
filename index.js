// server.js

const { PromptTemplate } = require("langchain/prompts");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { createClient } = require('@supabase/supabase-js');


const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Définissez une route API
app.get('/api/question', async (req, res) => {
    const question = req.query.question;
    // openia api key
    const openiakeyapi = process.env.OPENAI_API_KEY;
    // embeddings
    const embeddings = new OpenAIEmbeddings({ openiakeyapi });
    // supabase info
    const sbApiKey = process.env.SUPABASE_API_KEY;
    const sbURL = process.env.SUPABASE_URL_LC_CHATBOT;
    const client = createClient(sbURL,sbApiKey);
    // llm
    const llm = new ChatOpenAI({ openiakeyapi });
    // standalone question
    const standaloneQuestion = `Given a question, convert it to a standalone question. question: {question}`;
    // question promp
    const standaloneQuestionPromp = PromptTemplate.fromTemplate( standaloneQuestion );
    // chain using pipe
    const standaloneQuestionChain = standaloneQuestionPromp.pipe(llm);
    // invoke
    const responseia = await standaloneQuestionChain.invoke({question});
    
    return res.json(responseia.content);
    
});

// Démarrer le serveur
app.listen(port, () => {
 console.log(`Serveur démarré sur le port ${port}`);
});