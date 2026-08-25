export type LockNotificationTarget =
  | { type: "messagesConversation"; conversationId: string }
  | { type: "app"; appId: string };

export type ActiveLockNotification = {
  id: string;
  sourceApp: string;
  target: LockNotificationTarget;
  timestamp: string | null;
  payload: {
    title: string;
    sender?: string;
    message: string;
  };
};

export type LockNotificationEvent =
  | { type: "PRESENT"; notification: ActiveLockNotification }
  | { type: "CLEAR" }
  | { type: "RESET" };

export type LockNotificationState = ActiveLockNotification | null;

export const initialLockNotificationState: LockNotificationState = null;

export function lockNotificationStateTransition(
  state: LockNotificationState,
  event: LockNotificationEvent,
): LockNotificationState {
  switch (event.type) {
    case "PRESENT":
      return event.notification;
    case "CLEAR":
    case "RESET":
      return null;
  }
}
