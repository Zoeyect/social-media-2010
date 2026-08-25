export type DeviceEvent = {
  id: string;
  type: "initialSMS" | "momReply";
  dueElapsedMs: number;
};

export function scheduleDeviceEvent(events: readonly DeviceEvent[], event: DeviceEvent): DeviceEvent[] {
  return events.some(scheduled => scheduled.id === event.id)
    ? [...events]
    : [...events, event].sort((a, b) => a.dueElapsedMs - b.dueElapsedMs);
}

export function nextDueDeviceEvent(events: readonly DeviceEvent[], elapsed: number): DeviceEvent | null {
  return events.find(event => event.dueElapsedMs <= elapsed) ?? null;
}

export function removeDeviceEvent(events: readonly DeviceEvent[], eventId: string): DeviceEvent[] {
  return events.filter(event => event.id !== eventId);
}
