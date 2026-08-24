import { Dispatch, KeyboardEvent } from "react";
import { DeviceAudio } from "../audio/deviceAudio";
import { MessagesEvent, MessagesState } from "../state/messagesState";

type MessagesExperienceProps = {
  state: MessagesState;
  dispatch: Dispatch<MessagesEvent>;
  onOpenConversation: () => void;
};

export function MessagesExperience({ state, dispatch, onOpenConversation }: MessagesExperienceProps) {
  if (state.view === "list") {
    return <section className="messages-app" aria-label="Messages">
      <header className="messages-navigation-bar"><strong>Messages</strong></header>
      {state.initialMessage && <button className="messages-conversation-row" onClick={onOpenConversation}>
        <strong>{state.initialMessage.sender}</strong>
        <span>{state.initialMessage.message}</span>
        <i aria-hidden="true">›</i>
      </button>}
    </section>;
  }

  const keyboardTap = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && (event.key.length === 1 || event.key === "Backspace")) {
      DeviceAudio.keyboardTap();
    }
  };

  const send = () => {
    if (!state.draft.trim() || state.sentText !== null) return;
    DeviceAudio.messageSent();
    dispatch({ type: "SEND" });
  };

  return <section className="messages-app" aria-label="Conversation with Mom">
    <header className="messages-navigation-bar">
      <button className="messages-back-button" onClick={() => dispatch({ type: "BACK_TO_LIST" })}>Messages</button>
      <strong>Mom</strong>
    </header>
    <div className="messages-thread" aria-live="polite">
      {state.initialMessage && <p className="sms-bubble is-incoming">{state.initialMessage.message}</p>}
      {state.sentText && <p className="sms-bubble is-outgoing">{state.sentText}</p>}
      {state.momReply === "received" && <p className="sms-bubble is-incoming">Good. Sleep early.</p>}
    </div>
    <form className="messages-composer" onSubmit={event => { event.preventDefault(); send(); }}>
      <input
        aria-label="Message"
        value={state.draft}
        disabled={state.sentText !== null}
        onChange={event => dispatch({ type: "EDIT_DRAFT", value: event.target.value })}
        onKeyDown={keyboardTap}
      />
      <button type="submit" disabled={!state.draft.trim() || state.sentText !== null}>Send</button>
    </form>
  </section>;
}
