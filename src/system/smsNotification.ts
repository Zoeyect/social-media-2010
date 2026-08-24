import { DeviceAudio } from "../audio/deviceAudio";
import { MessagesBadgeEvent } from "../state/messagesBadgeState";
import { MessagesEvent } from "../state/messagesState";
import { SMSNotificationEvent, SMSNotificationSource } from "../state/smsNotificationState";

export type IncomingSMS = {
  id: string;
  sender: string;
  message: string;
};

type SMSMessageReceivedTargets = {
  notificationDispatch: (event: SMSNotificationEvent) => void;
  badgeDispatch: (event: MessagesBadgeEvent) => void;
  messagesDispatch: (event: MessagesEvent) => void;
};

export function smsMessageReceived(
  sms: IncomingSMS,
  source: SMSNotificationSource,
  targets: SMSMessageReceivedTargets,
): void {
  targets.notificationDispatch({ type: "RECEIVE", notification: { ...sms, source } });
  DeviceAudio.notificationReceived("message");
  targets.badgeDispatch({ type: "ADD_UNREAD", messageId: sms.id });
  targets.messagesDispatch({ type: "RECEIVE_MESSAGE", id: sms.id, sender: sms.sender, message: sms.message });
  targets.notificationDispatch({ type: "PRESENT" });
}
