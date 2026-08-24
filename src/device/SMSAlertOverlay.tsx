import { SMSNotification } from "../state/smsNotificationState";

type SMSAlertOverlayProps = {
  notification: SMSNotification;
  onClose: () => void;
  onView: () => void;
};

export function SMSAlertOverlay({ notification, onClose, onView }: SMSAlertOverlayProps) {
  if (notification.status !== "presenting") return null;

  return <div className="sms-system-alert-layer" role="presentation">
    <section className="sms-alert-sheet" role="alertdialog" aria-modal="true" aria-labelledby="sms-alert-title" aria-describedby="sms-alert-content">
      <strong id="sms-alert-title">Text Message</strong>
      <div id="sms-alert-content" className="sms-alert-content">
        <b>{notification.sender}</b>
        <p>{notification.message}</p>
        <small>Touch View to see entire message</small>
      </div>
      <div className="sms-alert-actions">
        <button onClick={onClose}>Close</button>
        <button onClick={onView}>View</button>
      </div>
    </section>
  </div>;
}
