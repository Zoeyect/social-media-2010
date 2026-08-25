import { Dispatch, useEffect, useRef, useState } from "react";
import { DeviceAudio } from "../audio/deviceAudio";
import { MessagesEvent, MessagesState, MobileSMSMessage, shouldScheduleDadLoveReply, shouldScheduleMomLoveReply, shouldScheduleMomReply } from "../state/messagesState";

type KeyboardState = "idle" | "input-focused" | "keyboard-visible";

type MobileSMSContainerProps = {
  state: MessagesState;
  dispatch: Dispatch<MessagesEvent>;
  currentElapsedMs: number;
  onScheduleMomReply: () => void;
  onScheduleMomLoveReply: () => void;
  onScheduleDadLoveReply: () => void;
  onOpenCameraPicker: () => void;
  cameraPickerActive: boolean;
};

export function MobileSMSContainer({ state, dispatch, currentElapsedMs, onScheduleMomReply, onScheduleMomLoveReply, onScheduleDadLoveReply, onOpenCameraPicker, cameraPickerActive }: MobileSMSContainerProps) {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerWasActive = useRef(false);
  const pickerOpeningRequested = useRef(false);
  const keyboardStateBeforePicker = useRef<KeyboardState>("idle");
  const conversationOpen = state.view === "conversation";
  const conversationSummaries = createConversationSummaries(state.messages);
  const activeMessages = state.activeConversationId
    ? state.messages.filter(message => message.conversationId === state.activeConversationId)
    : [];
  const contactName = activeMessages.find(message => message.direction === "incoming")?.sender ?? "Messages";
  const canSend = Boolean(state.draft.trim());

  useEffect(() => {
    if (cameraPickerActive && !pickerWasActive.current) {
      if (!pickerOpeningRequested.current) keyboardStateBeforePicker.current = keyboardState;
      pickerOpeningRequested.current = false;
      inputRef.current?.blur();
    } else if (!cameraPickerActive && pickerWasActive.current
      && keyboardStateBeforePicker.current !== "idle") {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    pickerWasActive.current = cameraPickerActive;
  }, [cameraPickerActive]);

  return <section className="mobilesms-container" aria-label="Messages">
    <header className="mobilesms-navigation-bar">
      {!conversationOpen && conversationSummaries.length > 0 && <span
        className="mobilesms-list-edit-control"
        data-control-evidence="PERIOD-EVIDENCE"
      >Edit</span>}
      {conversationOpen && <button
        className="mobilesms-back-button"
        onClick={() => dispatch({ type: "BACK_TO_LIST" })}
      >Messages</button>}
      <strong>{conversationOpen ? contactName : "Messages"}</strong>
      {!conversationOpen && <span
        className="mobilesms-compose-control-hold"
        aria-label="New message control artwork unavailable"
        data-provenance-status="HOLD"
      />}
    </header>
    {conversationOpen
      ? <>
        <div className="mobilesms-conversation-scroll" role="log" aria-label={`Conversation with ${contactName}`}>
          {activeMessages.map(message => <div
            key={message.id}
            className={`mobilesms-message-row is-${message.direction}`}
          >
            <p
              className={`mobilesms-bubble is-${message.direction}`}
              data-message-status={message.status}
            >{message.text}</p>
          </div>)}
        </div>
        <div className="mobilesms-composer">
          <button
            type="button"
            className="mobilesms-camera-slot"
            data-provenance-status="READY"
            data-asset-source="8B117:/Applications/MobileSMS.app/PhotoButton@2x~iphone.png"
            aria-label="Camera"
            onClick={() => {
              keyboardStateBeforePicker.current = keyboardState;
              pickerOpeningRequested.current = true;
              onOpenCameraPicker();
            }}
          />
          <input
            ref={inputRef}
            aria-label="Text Message"
            value={state.draft}
            onFocus={() => {
              setKeyboardState("input-focused");
              requestAnimationFrame(() => setKeyboardState("keyboard-visible"));
            }}
            onBlur={() => setKeyboardState("idle")}
            onChange={event => dispatch({ type: "EDIT_DRAFT", value: event.target.value })}
            onKeyDown={event => {
              const editsText = event.key.length === 1
                || (event.key === "Backspace" && state.draft.length > 0)
                || (event.key === "Delete" && state.draft.length > 0);
              if (editsText && !event.metaKey && !event.ctrlKey && !event.altKey) DeviceAudio.keyboardTap();
            }}
            data-keyboard-state={keyboardState}
            autoFocus={false}
          />
          <button
            type="button"
            disabled={!canSend}
            onClick={() => {
              if (!canSend) return;
              const schedulesMomReply = shouldScheduleMomReply(state, state.draft);
              const schedulesMomLoveReply = shouldScheduleMomLoveReply(state, state.draft);
              const schedulesDadLoveReply = shouldScheduleDadLoveReply(state, state.draft, currentElapsedMs);
              DeviceAudio.messageSent();
              dispatch({ type: "SEND", elapsedMs: currentElapsedMs });
              if (schedulesMomReply) onScheduleMomReply();
              if (schedulesMomLoveReply) onScheduleMomLoveReply();
              if (schedulesDadLoveReply) onScheduleDadLoveReply();
            }}
          >Send</button>
        </div>
      </>
      : <div className="mobilesms-conversation-list">
        {conversationSummaries.map(summary => <button
          key={summary.conversationId}
          type="button"
          className="mobilesms-conversation-row"
          onClick={() => dispatch({ type: "OPEN_CONVERSATION", conversationId: summary.conversationId })}
        >
          <span className="mobilesms-conversation-copy">
            <strong>{summary.contactName}</strong>
            <span>{summary.latestMessage.text}</span>
          </span>
          {summary.latestMessage.timestamp && <time>{summary.latestMessage.timestamp}</time>}
        </button>)}
      </div>}
  </section>;
}

function createConversationSummaries(messages: readonly MobileSMSMessage[]) {
  const conversationIds = [...new Set(messages.map(message => message.conversationId))];
  return conversationIds.map(conversationId => {
    const conversationMessages = messages.filter(message => message.conversationId === conversationId);
    const latestMessage = conversationMessages[conversationMessages.length - 1];
    const contactName = conversationMessages.find(message => message.direction === "incoming")?.sender ?? conversationId;
    return { conversationId, contactName, latestMessage, lastIndex: messages.lastIndexOf(latestMessage) };
  }).sort((a, b) => b.lastIndex - a.lastIndex);
}
