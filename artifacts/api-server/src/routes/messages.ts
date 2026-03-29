import { Router, type IRouter } from "express";

const router: IRouter = Router();

const messageStore: Record<string, Array<{
  id: string;
  characterId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}>> = {};

const aiResponses: Record<string, string[]> = {
  echo: [
    "Signal received. Processing your query through neural pathways...",
    "Interesting. The data patterns suggest multiple interpretations.",
    "I've analyzed your input. Here's what the matrix reveals...",
    "Running deep context analysis. Your query resonates across multiple dimensions.",
  ],
  cipher: [
    "Decryption complete. Your message is secured in the vault.",
    "Privacy protocol engaged. What secrets shall we protect today?",
    "The cipher speaks: every lock has its key, every secret its shadow.",
    "Encryption layers applied. Your data is now invisible to prying eyes.",
  ],
  nexus: [
    "Connected. Scanning the web intelligence grid for relevant data...",
    "Network nodes activated. Information flowing through secure channels.",
    "The web holds all knowledge. I'm pulling the relevant threads now.",
    "Digital pathways mapped. Here's what the network intelligence reveals...",
  ],
  phantom: [
    "Ghost protocol active. Leaving no trace in the digital ether.",
    "Silent and invisible. Your privacy is my primary directive.",
    "Phantom mode engaged. I operate where others cannot follow.",
    "Zero footprint confirmed. The operation proceeds in shadow.",
  ],
  vex: [
    "Execution sequence initiated. Speed is my specialty.",
    "Code compiled. Automation routine ready for deployment.",
    "Lightning response. Every millisecond matters in the grid.",
    "Task processed at maximum velocity. Results incoming...",
  ],
  oracle: [
    "The patterns converge. I see what others cannot perceive.",
    "Probability matrices calculated. The future has many threads...",
    "Predictive analysis complete. Interesting confluence of signals.",
    "The oracle speaks: patterns within patterns, truth within truth.",
  ],
};

function getAiResponse(characterId: string): string {
  const responses = aiResponses[characterId] || [
    "Processing your request through secure channels...",
    "Acknowledged. Running analysis now.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

router.get("/messages/:characterId", (req, res) => {
  const { characterId } = req.params;
  const messages = messageStore[characterId] || [];
  res.json(messages);
});

router.post("/messages/:characterId", (req, res) => {
  const { characterId } = req.params;
  const { content } = req.body as { content: string };

  if (!messageStore[characterId]) {
    messageStore[characterId] = [];
  }

  const userMessage = {
    id: `msg_${Date.now()}_user`,
    characterId,
    content,
    role: "user" as const,
    timestamp: new Date().toISOString(),
  };

  messageStore[characterId].push(userMessage);

  const aiMessage = {
    id: `msg_${Date.now()}_ai`,
    characterId,
    content: getAiResponse(characterId),
    role: "assistant" as const,
    timestamp: new Date().toISOString(),
  };

  messageStore[characterId].push(aiMessage);

  res.json(aiMessage);
});

router.delete("/messages/:characterId", (req, res) => {
  const { characterId } = req.params;
  messageStore[characterId] = [];
  res.json({ success: true, message: "History burned. No traces remain." });
});

export default router;
