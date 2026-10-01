import { EventEmitter } from "node:events";
import type {
  ChatOverlayEvent,
  ChatOverlayModerationEvent
} from "@elobadge/core";

const overlayEvents = new EventEmitter();

overlayEvents.setMaxListeners(100);

export function publishChatOverlayEvent(
  streamerUid: string,
  event: ChatOverlayEvent
) {
  overlayEvents.emit(streamerChatEventName(streamerUid), event);
}

export function subscribeStreamerChatOverlayEvents(
  streamerUid: string,
  listener: (event: ChatOverlayEvent) => void
) {
  const eventName = streamerChatEventName(streamerUid);
  overlayEvents.on(eventName, listener);

  return () => {
    overlayEvents.off(eventName, listener);
  };
}

export function publishChatOverlayModerationEvent(
  streamerUid: string,
  event: ChatOverlayModerationEvent
) {
  overlayEvents.emit(streamerModerationEventName(streamerUid), event);
}

export function subscribeStreamerChatOverlayModerationEvents(
  streamerUid: string,
  listener: (event: ChatOverlayModerationEvent) => void
) {
  const eventName = streamerModerationEventName(streamerUid);
  overlayEvents.on(eventName, listener);

  return () => {
    overlayEvents.off(eventName, listener);
  };
}

function streamerChatEventName(streamerUid: string) {
  return `chat:${streamerUid}`;
}

function streamerModerationEventName(streamerUid: string) {
  return `moderation:${streamerUid}`;
}
