export type SMSNotificationStatus = "received" | "presenting" | "dismissed" | "viewed";
export type SMSNotificationSource = "foreground" | "lockscreen";

export type SMSNotification = {
  id: string;
  sender: string;
  message: string;
  status: SMSNotificationStatus;
  source: SMSNotificationSource;
};

export type SMSNotificationEvent =
  | { type: "RECEIVE"; notification: Omit<SMSNotification, "status"> }
  | { type: "PRESENT" }
  | { type: "DISMISS" }
  | { type: "VIEW" };

export function smsNotificationStateTransition(
  state: SMSNotification | null,
  event: SMSNotificationEvent,
): SMSNotification | null {
  switch (event.type) {
    case "RECEIVE":
      return state?.id === event.notification.id
        ? state
        : { ...event.notification, status: "received" };
    case "PRESENT":
      return state?.status === "received" ? { ...state, status: "presenting" } : state;
    case "DISMISS":
      return state?.status === "presenting" ? { ...state, status: "dismissed" } : state;
    case "VIEW":
      return state && state.status !== "viewed" ? { ...state, status: "viewed" } : state;
  }
}
