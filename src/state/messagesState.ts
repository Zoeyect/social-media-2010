export type MessagesView = "list" | "conversation";
export type MessageDirection = "incoming" | "outgoing";
export type MessageStatus = "unread" | "read" | "sent";
export type MomReplyEligibility = "none" | "affirmative";
export type MomReplyState = "none" | "pending" | "delivered";
export type MomReplyClassification = "affirmative" | "negative" | "ambiguous";

export type MobileSMSMessage = {
  id: string;
  sender: string;
  text: string;
  direction: MessageDirection;
  timestamp: string | null;
  status: MessageStatus;
};

export type MessagesState = {
  view: MessagesView;
  messages: readonly MobileSMSMessage[];
  draft: string;
  momReplyEligibility: MomReplyEligibility;
  momReply: MomReplyState;
};

export type MessagesEvent =
  | { type: "OPEN_CONVERSATION" }
  | { type: "RECEIVE_MESSAGE"; id: string; sender: string; message: string; timestamp?: string | null }
  | { type: "BACK_TO_LIST" }
  | { type: "EDIT_DRAFT"; value: string }
  | { type: "SEND" }
  | { type: "DELIVER_MOM_REPLY" }
  | { type: "MARK_MOM_REPLY_DELIVERED" }
  | { type: "RESET_RUNTIME" };

export const initialMessagesState: MessagesState = {
  view: "list",
  messages: [],
  draft: "",
  momReplyEligibility: "none",
  momReply: "none",
};

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
  return state.momReply === "none" && classifyMomReply(text) === "affirmative";
}

export function messagesStateTransition(state: MessagesState, event: MessagesEvent): MessagesState {
  switch (event.type) {
    case "OPEN_CONVERSATION":
      return {
        ...state,
        view: "conversation",
        messages: state.messages.map(message => message.direction === "incoming" && message.status === "unread"
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
              sender: event.sender,
              text: event.message,
              direction: "incoming",
              timestamp: event.timestamp ?? null,
              status: "unread",
            }],
          };
    case "BACK_TO_LIST":
      return { ...state, view: "list" };
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
              sender: "Me",
              text,
              direction: "outgoing",
              timestamp: null,
              status: "sent",
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
              sender: "Mom",
              text: "Good. Sleep early.",
              direction: "incoming",
              timestamp: null,
              status: "read",
            }],
          }
        : state;
    case "MARK_MOM_REPLY_DELIVERED":
      return state.momReply === "pending" ? { ...state, momReply: "delivered" } : state;
    case "RESET_RUNTIME":
      return {
        view: "list",
        messages: [],
        draft: "",
        momReplyEligibility: "none",
        momReply: "none",
      };
  }
}
