export type MessagesView = "list" | "conversation";
export type MomReplyState = "notSent" | "pending" | "received";

export type MessagesState = {
  view: MessagesView;
  initialMessage: { id: string; sender: string; message: string } | null;
  draft: string;
  sentText: string | null;
  momReply: MomReplyState;
};

export type MessagesEvent =
  | { type: "OPEN_CONVERSATION" }
  | { type: "RECEIVE_MESSAGE"; id: string; sender: string; message: string }
  | { type: "BACK_TO_LIST" }
  | { type: "EDIT_DRAFT"; value: string }
  | { type: "SEND" }
  | { type: "RECEIVE_MOM_REPLY" };

export const initialMessagesState: MessagesState = {
  view: "list",
  initialMessage: null,
  draft: "",
  sentText: null,
  momReply: "notSent",
};

export function messagesStateTransition(state: MessagesState, event: MessagesEvent): MessagesState {
  switch (event.type) {
    case "OPEN_CONVERSATION":
      return { ...state, view: "conversation" };
    case "RECEIVE_MESSAGE":
      return state.initialMessage?.id === event.id
        ? state
        : { ...state, initialMessage: { id: event.id, sender: event.sender, message: event.message } };
    case "BACK_TO_LIST":
      return { ...state, view: "list" };
    case "EDIT_DRAFT":
      return state.sentText === null ? { ...state, draft: event.value } : state;
    case "SEND": {
      const text = state.draft.trim();
      return text && state.sentText === null
        ? { ...state, draft: "", sentText: text, momReply: "pending" }
        : state;
    }
    case "RECEIVE_MOM_REPLY":
      return state.momReply === "pending" ? { ...state, momReply: "received" } : state;
  }
}
