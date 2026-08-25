import { DeviceAudio } from "../audio/deviceAudio";
import { MessagesBadgeEvent } from "../state/messagesBadgeState";
import { MessagesEvent } from "../state/messagesState";
import { ActiveLockNotification, LockNotificationEvent } from "../state/lockNotificationState";
import { SMSNotificationEvent, SMSNotificationSource } from "../state/smsNotificationState";

export type IncomingSMS = {
  id: string;
  sender: string;
  message: string;
  timestamp?: string | null;
};

export function createSMSLockNotification(sms: IncomingSMS): ActiveLockNotification {
  return {
    id: sms.id,
    sourceApp: "messages",
    target: { type: "messagesConversation", conversationId: "mom" },
    timestamp: sms.timestamp ?? null,
    payload: {
      title: "Text Message",
      sender: sms.sender,
      message: sms.message,
    },
  };
}

type SMSMessageReceivedTargets = {
  notificationDispatch: (event: SMSNotificationEvent) => void;
  badgeDispatch: (event: MessagesBadgeEvent) => void;
  messagesDispatch: (event: MessagesEvent) => void;
  lockNotificationDispatch?: (event: LockNotificationEvent) => void;
};

export function smsMessageReceived(
  sms: IncomingSMS,
  source: SMSNotificationSource,
  targets: SMSMessageReceivedTargets,
): void {
  targets.notificationDispatch({ type: "RECEIVE", notification: { ...sms, source } });
  DeviceAudio.notificationReceived("message");
  targets.badgeDispatch({ type: "ADD_UNREAD", messageId: sms.id });
  targets.messagesDispatch({ type: "RECEIVE_MESSAGE", id: sms.id, sender: sms.sender, message: sms.message, timestamp: sms.timestamp });
  if (source === "lockscreen") {
    targets.lockNotificationDispatch?.({
      type: "PRESENT",
      notification: createSMSLockNotification(sms),
    });
  }
  targets.notificationDispatch({ type: source === "lockscreen" ? "SHOW_PREVIEW" : "SHOW_ALERT" });
}
