import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type MessagesView = "list" | "conversation";
export type MessageDirection = "incoming" | "outgoing";
export type MessageStatus = "unread" | "read" | "sent";
export type MomReplyEligibility = "none" | "affirmative";
export type MomReplyState = "none" | "pending" | "delivered";
export type MomReplyClassification = "affirmative" | "negative" | "ambiguous";

export type MobileSMSMessage = {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  direction: MessageDirection;
  timestamp: string | null;
  status: MessageStatus;
  origin: ContentOrigin;
};

export type MessagesState = {
  view: MessagesView;
  activeConversationId: string | null;
  messages: readonly MobileSMSMessage[];
  draft: string;
  momReplyEligibility: MomReplyEligibility;
  momReply: MomReplyState;
};

export type MessagesEvent =
  | { type: "OPEN_CONVERSATION"; conversationId?: string }
  | { type: "RECEIVE_MESSAGE"; id: string; conversationId?: string; sender: string; message: string; timestamp?: string | null }
  | { type: "BACK_TO_LIST" }
  | { type: "EDIT_DRAFT"; value: string }
  | { type: "SEND" }
  | { type: "DELIVER_MOM_REPLY" }
  | { type: "MARK_MOM_REPLY_DELIVERED" }
  | { type: "RESET_RUNTIME" };

export function createInitialMessagesState(): MessagesState {
  return {
    view: "list",
    activeConversationId: null,
    messages: SESSION_SEED_CONTENT.messages.map(message => ({ ...message })),
    draft: "",
    momReplyEligibility: "none",
    momReply: "none",
  };
}

export const initialMessagesState: MessagesState = createInitialMessagesState();

const NEGATIVE_MOM_REPLIES = new Set([
  "no",
  "nope",
  "not yet",
  "not home",
  "still out",
  "还没",
  "没有",
  "还没到",
]);

const AFFIRMATIVE_MOM_REPLIES = new Set([
  "yes",
  "yeah",
  "yep",
  "yup",
  "i'm home",
  "i am home",
  "home",
  "got home",
  "i'm back",
  "arrived",
  "到了",
  "到家了",
]);

export function normalizeMomReply(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[’‘]/g, "'")
    .replace(/[.,!！。？，?]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function classifyMomReply(text: string): MomReplyClassification {
  const normalized = normalizeMomReply(text);
  if (NEGATIVE_MOM_REPLIES.has(normalized)) return "negative";
  if (AFFIRMATIVE_MOM_REPLIES.has(normalized)) return "affirmative";
  return "ambiguous";
}

export function shouldScheduleMomReply(state: MessagesState, text: string): boolean {
  return state.activeConversationId === "mom"
    && state.momReply === "none"
    && classifyMomReply(text) === "affirmative";
}

export function messagesStateTransition(state: MessagesState, event: MessagesEvent): MessagesState {
  switch (event.type) {
    case "OPEN_CONVERSATION":
      const conversationId = event.conversationId ?? "mom";
      return {
        ...state,
        view: "conversation",
        activeConversationId: conversationId,
        messages: state.messages.map(message => message.conversationId === conversationId && message.direction === "incoming" && message.status === "unread"
          ? { ...message, status: "read" }
          : message),
      };
    case "RECEIVE_MESSAGE":
      return state.messages.some(message => message.id === event.id)
        ? state
        : {
            ...state,
            messages: [...state.messages, {
              id: event.id,
              conversationId: event.conversationId ?? event.sender.toLocaleLowerCase("en-US"),
              sender: event.sender,
              text: event.message,
              direction: "incoming",
              timestamp: event.timestamp ?? null,
              status: "unread",
              origin: "live",
            }],
          };
    case "BACK_TO_LIST":
      return { ...state, view: "list", activeConversationId: null };
    case "EDIT_DRAFT":
      return { ...state, draft: event.value };
    case "SEND": {
      const text = state.draft.trim();
      const outgoingSequence = state.messages.filter(message => message.direction === "outgoing").length + 1;
      const schedulesMomReply = shouldScheduleMomReply(state, text);
      return text
        ? {
            ...state,
            draft: "",
            momReplyEligibility: schedulesMomReply ? "affirmative" : state.momReplyEligibility,
            momReply: schedulesMomReply ? "pending" : state.momReply,
            messages: [...state.messages, {
              id: `user-message-${outgoingSequence}`,
              conversationId: state.activeConversationId ?? "mom",
              sender: "Me",
              text,
              direction: "outgoing",
              timestamp: null,
              status: "sent",
              origin: "live",
            }],
          }
        : state;
    }
    case "DELIVER_MOM_REPLY":
      return state.momReply === "pending"
        ? {
            ...state,
            momReply: "delivered",
            messages: [...state.messages, {
              id: "mom-sleep-early",
              conversationId: "mom",
              sender: "Mom",
              text: "Good. Sleep early.",
              direction: "incoming",
              timestamp: null,
              status: "read",
              origin: "live",
            }],
          }
        : state;
    case "MARK_MOM_REPLY_DELIVERED":
      return state.momReply === "pending" ? { ...state, momReply: "delivered" } : state;
    case "RESET_RUNTIME":
      return createInitialMessagesState();
  }
}
