/**
 * Creates a Daily.co video room for a session. Returns a full room URL
 * (e.g. "https://yourteam.daily.co/fajr-abc123") that can be embedded
 * directly in an iframe — no further API calls needed to join.
 *
 * Falls back to a plain room-name string (handled by SessionRoom as a
 * Jitsi room) when DAILY_API_KEY isn't configured yet, so booking never
 * breaks while the account is being set up.
 */
export async function createVideoRoom(baseId: string, endAt: Date): Promise<string> {
  const apiKey = process.env.DAILY_API_KEY;
  const roomName = `fajr-${baseId}`;

  if (!apiKey) {
    return roomName;
  }

  const expiresAt = Math.floor(endAt.getTime() / 1000) + 2 * 60 * 60; // +2h buffer after session end

  try {
    const res = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: {
          exp: expiresAt,
          enable_chat: true,
          enable_screenshare: true,
          eject_at_room_exp: true,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to create Daily.co room, falling back to Jitsi:", text);
      return roomName;
    }

    const data = await res.json();
    return data.url || roomName;
  } catch (err) {
    console.error("Daily.co request failed, falling back to Jitsi:", err);
    return roomName;
  }
}
