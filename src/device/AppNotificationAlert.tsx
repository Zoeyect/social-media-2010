import type { NotificationEvent } from "../state/notificationState";

// Existing iOS 4 alert geometry/material. Exact third-party copy is reconstructed.
export function AppNotificationAlert({ notification, onClose, onView }: {
  notification: NotificationEvent;
  onClose: () => void;
  onView: () => void;
}) {
  return <div className="sms-system-alert-layer" role="presentation" data-notification-status="RECONSTRUCTED">
    <section className="sms-alert-sheet" role="alertdialog" aria-modal="true" aria-labelledby="app-notification-title" aria-describedby="app-notification-body">
      <strong id="app-notification-title" className="sms-alert-title">{notification.title}</strong>
      <div id="app-notification-body" className="sms-alert-content">
        {notification.sender && <b className="sms-alert-sender">{notification.sender}</b>}
        <p className="sms-alert-body">{notification.body}</p>
      </div>
      <div className="sms-alert-actions">
        <button type="button" onClick={onClose}>Close</button>
        <button type="button" onClick={onView}>View</button>
      </div>
    </section>
  </div>;
}
