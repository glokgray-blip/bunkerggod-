import { Router, type IRouter } from "express";

const router: IRouter = Router();

const characters = [
  {
    id: "echo",
    name: "Echo",
    avatar: "🤖",
    status: "online",
    description: "Neural language specialist. Master of context and conversation.",
    specialty: "Deep Analysis",
  },
  {
    id: "cipher",
    name: "Cipher",
    avatar: "🔐",
    status: "online",
    description: "Cryptography and security expert. Keeper of secrets.",
    specialty: "Encryption",
  },
  {
    id: "nexus",
    name: "Nexus",
    avatar: "🌐",
    status: "online",
    description: "Web intelligence agent. Navigates the digital realm.",
    specialty: "Web Research",
  },
  {
    id: "phantom",
    name: "Phantom",
    avatar: "👻",
    status: "online",
    description: "Ghost protocol operative. Zero trace, maximum privacy.",
    specialty: "Privacy Ops",
  },
  {
    id: "vex",
    name: "Vex",
    avatar: "⚡",
    status: "online",
    description: "Rapid-fire code executor. Automation at light speed.",
    specialty: "Automation",
  },
  {
    id: "oracle",
    name: "Oracle",
    avatar: "🔮",
    status: "busy",
    description: "Predictive intelligence. Sees patterns others miss.",
    specialty: "Prediction",
  },
];

router.get("/characters", (_req, res) => {
  res.json(characters);
});

export default router;
