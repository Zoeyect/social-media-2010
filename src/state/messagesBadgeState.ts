export type MessagesBadgeState = readonly string[];

export type MessagesBadgeEvent =
  | { type: "ADD_UNREAD"; messageId: string }
  | { type: "MARK_READ"; messageId: string }
  | { type: "RESET" };

export function messagesBadgeStateTransition(
  state: MessagesBadgeState,
  event: MessagesBadgeEvent,
): MessagesBadgeState {
  switch (event.type) {
    case "ADD_UNREAD":
      return state.includes(event.messageId) ? state : [...state, event.messageId];
    case "MARK_READ":
      return state.filter(messageId => messageId !== event.messageId);
    case "RESET":
      return [];
  }
}
