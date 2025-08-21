interface UIMessage {
    id: string;
    content: string;
    isUser: boolean;
}

interface Message {
    role: "user" | "assistant" | "developer";
    content: string;
}

export type { Message, UIMessage };