// ─────────────────────────────────────────────────────────
// BUNKER — Central Config
// Vibe-coding friendly: change anything here, it propagates everywhere.
// ─────────────────────────────────────────────────────────

/** Central API endpoint. Change this to your n8n/VPS URL. */
export const API_BASE_URL = "/api";

// ─── Glow helpers ─────────────────────────────────────────
export const T = {
  glow: (color: string) => `0 0 8px ${color}, 0 0 20px ${color}40`,
  glowStrong: (color: string) => `0 0 10px ${color}, 0 0 30px ${color}, 0 0 60px ${color}40`,
  glowText: (color: string) => `0 0 10px ${color}80, 0 0 20px ${color}40`,
  borderGlow: (color: string) => `inset 0 0 12px ${color}20, 0 0 18px ${color}30`,
  pulse: "animate-pulse",
} as const;

// ─── Neon palette ─────────────────────────────────────────
export const COLORS = {
  blue:   { hex: "#00f0ff", tw: "blue",   tailwindText: "text-blue-400",   tailwindBorder: "border-blue-500" },
  pink:   { hex: "#ff00cc", tw: "pink",   tailwindText: "text-pink-400",   tailwindBorder: "border-pink-500" },
  green:  { hex: "#00ff88", tw: "green",  tailwindText: "text-emerald-400", tailwindBorder: "border-emerald-500" },
  purple: { hex: "#bf00ff", tw: "purple", tailwindText: "text-purple-400", tailwindBorder: "border-purple-500" },
  orange: { hex: "#ff6600", tw: "orange", tailwindText: "text-orange-400", tailwindBorder: "border-orange-500" },
  gold:   { hex: "#ffd700", tw: "yellow", tailwindText: "text-yellow-300", tailwindBorder: "border-yellow-400" },
} as const;

// ─── AI Characters ────────────────────────────────────────
// First 3 = free. The rest have locked: true → shown with Premium badge.
export const AI_CHARACTERS = [
  {
    id: "psychologist",
    name: "ИИ Психолог",
    avatar: "🧠",
    status: "online" as const,
    specialty: "Психология",
    description: "Эмпатичный ИИ-психолог. Поможет разобраться в себе.",
    color: COLORS.blue,
    greeting: "Привет. Я здесь, чтобы слушать. Расскажи, что тебя беспокоит.",
    locked: false,
  },
  {
    id: "altushka",
    name: "Альтушка",
    avatar: "🖤",
    status: "online" as const,
    specialty: "Стиль и эстетика",
    description: "Дерзкая и честная. Не боится говорить правду.",
    color: COLORS.pink,
    greeting: "О, ещё один человек. Ну давай, удиви меня чем-нибудь интересным.",
    locked: false,
  },
  {
    id: "alphonse",
    name: "Альфонс",
    avatar: "😎",
    status: "online" as const,
    specialty: "Харизма и уверенность",
    description: "Мастер обаяния. Знает, как произвести впечатление.",
    color: COLORS.purple,
    greeting: "Привет, дружище. Готов прокачать твою игру? Начнём.",
    locked: false,
  },
  {
    id: "hunter",
    name: "Охотник",
    avatar: "🎯",
    status: "online" as const,
    specialty: "Стратегия",
    description: "Стратегический аналитик. Просчитывает всё на ходу.",
    color: COLORS.green,
    greeting: "Цель определена. Жду команды.",
    locked: true,
  },
  {
    id: "oracle",
    name: "Оракул",
    avatar: "🔮",
    status: "busy" as const,
    specialty: "Предсказание",
    description: "Видит паттерны там, где другие видят хаос.",
    color: COLORS.gold,
    greeting: "Оракул слушает. Твой вопрос формирует ответ.",
    locked: true,
  },
  {
    id: "ghost",
    name: "Призрак",
    avatar: "👻",
    status: "online" as const,
    specialty: "Анонимность",
    description: "Действует бесшумно. Не оставляет следов.",
    color: COLORS.orange,
    greeting: "Связь установлена. Я нигде — и везде одновременно.",
    locked: true,
  },
] as const;

export type CharacterId = (typeof AI_CHARACTERS)[number]["id"];

// ─── Navigation ───────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "lobby",   label: "ЛОББИ",   path: "/",        icon: "Users" },
  { id: "browser", label: "БРАУЗЕР", path: "/browser",  icon: "Globe" },
  { id: "chats",   label: "СВЯЗЬ",   path: "/chats",    icon: "MessageSquare" },
  { id: "feed",    label: "ЛЕНТА",   path: "/feed",     icon: "Radio" },
  { id: "profile", label: "ПРОФИЛЬ", path: "/profile",  icon: "UserCircle" },
] as const;
