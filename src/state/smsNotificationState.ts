export type SMSNotificationStatus =
  | "none"
  | "incoming"
  | "alert-visible"
  | "preview-visible"
  | "viewing"
  | "dismissed"
  | "opened";
export type SMSNotificationSource = "foreground" | "lockscreen";

export type SMSNotificationContent = {
  id: string;
  sender: string;
  message: string;
  source: SMSNotificationSource;
};

export type SMSNotificationState =
  | { status: "none"; notification: null }
  | { status: Exclude<SMSNotificationStatus, "none">; notification: SMSNotificationContent };

export type SMSNotificationEvent =
  | { type: "RECEIVE"; notification: SMSNotificationContent }
  | { type: "SHOW_ALERT" }
  | { type: "SHOW_PREVIEW" }
  | { type: "DISMISS" }
  | { type: "BEGIN_VIEW" }
  | { type: "OPEN" }
  | { type: "RESET" };

export const initialSMSNotificationState: SMSNotificationState = {
  status: "none",
  notification: null,
};

export function smsNotificationStateTransition(
  state: SMSNotificationState,
  event: SMSNotificationEvent,
): SMSNotificationState {
  switch (event.type) {
    case "RECEIVE":
      return state.notification?.id === event.notification.id
        ? state
        : { status: "incoming", notification: event.notification };
    case "SHOW_ALERT":
      return state.status === "incoming" ? { ...state, status: "alert-visible" } : state;
    case "SHOW_PREVIEW":
      return state.status === "incoming" || state.status === "alert-visible"
        ? { ...state, status: "preview-visible" }
        : state;
    case "DISMISS":
      return state.status === "alert-visible" ? { ...state, status: "dismissed" } : state;
    case "BEGIN_VIEW":
      return state.status === "alert-visible" || state.status === "preview-visible"
        ? { ...state, status: "viewing" }
        : state;
    case "OPEN":
      return state.status !== "none" && state.status !== "opened"
        ? { ...state, status: "opened" }
        : state;
    case "RESET":
      return initialSMSNotificationState;
  }
}
