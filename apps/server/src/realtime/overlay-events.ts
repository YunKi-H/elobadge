import { EventEmitter } from "node:events";
import type { ChatOverlayEvent } from "@chessbadge/core";

const chatEventName = "chat";
const overlayEvents = new EventEmitter();

overlayEvents.setMaxListeners(100);

export function publishChatOverlayEvent(event: ChatOverlayEvent) {
  overlayEvents.emit(chatEventName, event);
}

export function subscribeChatOverlayEvents(listener: (event: ChatOverlayEvent) => void) {
  overlayEvents.on(chatEventName, listener);

  return () => {
    overlayEvents.off(chatEventName, listener);
  };
}

