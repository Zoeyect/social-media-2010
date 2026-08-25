import { SMSNotificationState } from "../state/smsNotificationState";

type SMSAlertOverlayProps = {
  notificationState: SMSNotificationState;
  onClose: () => void;
  onView: () => void;
};

export function SMSAlertOverlay({ notificationState, onClose, onView }: SMSAlertOverlayProps) {
  if (notificationState.status !== "alert-visible") return null;
  const notification = notificationState.notification;

  return <div className="sms-system-alert-layer" role="presentation">
    <section className="sms-alert-sheet" role="alertdialog" aria-modal="true" aria-labelledby="sms-alert-title" aria-describedby="sms-alert-content">
      <strong id="sms-alert-title" className="sms-alert-title">Text Message</strong>
      <div id="sms-alert-content" className="sms-alert-content">
        <b className="sms-alert-sender">{notification.sender}</b>
        <p className="sms-alert-body">{notification.message}</p>
      </div>
      <div className="sms-alert-actions">
        <button type="button" onClick={onClose}>Close</button>
        <button type="button" onClick={onView}>View</button>
      </div>
    </section>
  </div>;
}
