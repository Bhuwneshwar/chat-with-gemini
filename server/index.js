const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const {
  setupKinde,
  protectRoute,
  getUser,
  GrantType,
} = require("@kinde-oss/kinde-node-express");

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const conversation = require("./models/conversation");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing. Please set it in the .env file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  clientId: "f2af4516ea38440394a3f1dc88d6477b",
  issuerBaseUrl: "https://rebyb.kinde.com",
  siteUrl: "http://localhost:3000",
  secret: process.env.KINDE_SECRET,
  redirectUrl: "http://localhost:3000/callback",
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE,
  unAuthorisedUrl: "http://localhost:3000/unauthorised",
  postLogoutRedirectUrl: "http://localhost:3000",
};

setupKinde(config, app);

// Routes
app.get("/api/admin", protectRoute, getUser, (req, res) => {
  res.send(
    `<h1>Welcome to the Admin Panel</h1><p>Hello, ${req.user.given_name}</p>`
  );
});

app.get("/api/user", protectRoute, getUser, (req, res) => {
  res.send({ success: true, user: req.user });
});

app.get("/api/chats", protectRoute, getUser, async (req, res) => {
  try {
    const chats = await conversation.find({
      userId: req.user.id,
    });
    return res.send({ chats, success: true });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});
app.get("/api/chats/:id", protectRoute, getUser, async (req, res) => {
  try {
    const conversationId = req.params.id;

    if (conversationId) {
      const chat = await conversation.findById(conversationId);
      if (!chat) {
        return res.status(404).json({ error: "Conversation not found." });
      }
      return res.send({ chat, success: true });
    } else return res.status(404).json({ error: "id is required!" });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

app.get("/unauthorised", (req, res) => {
  res.send(`
    <h1>Welcome to the Home Page</h1>
    <p>You are not authenticated.</p>
    <a href="/login">Sign In</a> | <a href="/register">Register</a>
  `);
});

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // responseMimeType: "application/json",
};

async function handleGeminiRequest(req, res) {
  try {
    const prompt = req.body.prompt || req.query.prompt;
    const user = req.user;
    const conversationId = req.body.id || req.query.id || req.params.id;

    if (!prompt) {
      return res.status(400).send({ error: "Prompt is required." });
    }

    const userInfo = `
      My first name: ${user.given_name}
      My last name: ${user.family_name}
      My full name: ${user.name}
      My email: ${user.email}
      My profile photo link:${user.picture}
    `;

    if (conversationId) {
      const chat = await conversation.findById(conversationId);
      if (!chat) {
        return res.status(404).json({ error: "Conversation not found." });
      }

      const history = JSON.parse(chat.conversations);
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          { role: "user", parts: [{ text: userInfo }] },
          {
            role: "model",
            parts: [{ text: "Thanks for sharing your information!" }],
          },
          ...history,
        ],
      });

      const result = await chatSession.sendMessage(
        JSON.stringify({ prompt, IndianTime: Date() })
      );
      const response = result.response.text();
      const savedChat = await conversation.findByIdAndUpdate(
        conversationId,
        {
          conversations: JSON.stringify([
            ...history,
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: response }] },
          ]),
        },
        { new: true }
      );

      res.json({ answer: response, newChat: false, savedChat });
    } else {
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          { role: "user", parts: [{ text: userInfo }] },
          {
            role: "model",
            parts: [{ text: "Thanks for sharing your information!" }],
          },
        ],
      });

      const result = await chatSession.sendMessage(
        JSON.stringify({ prompt, IndianTime: Date() })
      );
      const response = result.response.text();
      const savedChat = await conversation.create({
        userId: req.user.id,
        conversations: JSON.stringify([
          { role: "user", parts: [{ text: prompt }] },
          { role: "model", parts: [{ text: response }] },
        ]),
      });

      res.json({ answer: response, newChat: true, savedChat });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

app.post("/api/ask-gemini", protectRoute, getUser, handleGeminiRequest);

//app.use("Images", express.static(path.resolve("./client/dist/Images")));
app.use(express.static(path.resolve("./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) =>
      console.log(`Mongodb connected with server: ${data.connection.host}`)
    )
    .catch((e) => console.error("Database connection error:", e));
};

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  connectDatabase();
});
