import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_OVERLAY_MESSAGES,
  type ChatOverlayEvent,
  type OverlayMessageDurationSeconds
} from "@elobadge/core";

export function useOverlayMessageQueue(
  durationSeconds: OverlayMessageDurationSeconds
) {
  const [messages, setMessages] = useState<ChatOverlayEvent[]>([]);
  const messagesRef = useRef<ChatOverlayEvent[]>([]);
  const timersRef = useRef(new Map<string, number>());
  const durationSecondsRef = useRef(durationSeconds);

  const clearRemovalTimer = useCallback((messageId: string) => {
    const timer = timersRef.current.get(messageId);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(messageId);
    }
  }, []);

  const removeMessage = useCallback(
    (messageId: string) => {
      clearRemovalTimer(messageId);
      const next = messagesRef.current.filter(
        (message) => message.id !== messageId
      );
      messagesRef.current = next;
      setMessages(next);
    },
    [clearRemovalTimer]
  );

  const scheduleRemoval = useCallback(
    (messageId: string, seconds: OverlayMessageDurationSeconds) => {
      clearRemovalTimer(messageId);

      if (seconds === 0) {
        return;
      }

      const timer = window.setTimeout(() => {
        removeMessage(messageId);
      }, seconds * 1_000);
      timersRef.current.set(messageId, timer);
    },
    [clearRemovalTimer, removeMessage]
  );

  const addMessage = useCallback(
    (message: ChatOverlayEvent) => {
      const next = [
        ...messagesRef.current.filter((item) => item.id !== message.id),
        message
      ].slice(-MAX_OVERLAY_MESSAGES);
      const retainedIds = new Set(next.map((item) => item.id));

      for (const messageId of timersRef.current.keys()) {
        if (!retainedIds.has(messageId)) {
          clearRemovalTimer(messageId);
        }
      }

      messagesRef.current = next;
      setMessages(next);
      scheduleRemoval(message.id, durationSecondsRef.current);
    },
    [clearRemovalTimer, scheduleRemoval]
  );

  const clearMessages = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    messagesRef.current = [];
    setMessages([]);
  }, []);

  useEffect(() => {
    durationSecondsRef.current = durationSeconds;

    for (const message of messagesRef.current) {
      scheduleRemoval(message.id, durationSeconds);
    }
  }, [durationSeconds, scheduleRemoval]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { messages, addMessage, clearMessages };
}
