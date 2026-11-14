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
          max_participants: 2,
          enable_prejoin_ui: true,
          enable_network_ui: true,
          enable_noise_cancellation_ui: true,
          enable_video_processing_ui: true,
          // Every session room here is a strict 1:1 call (max_participants: 2),
          // so keep it peer-to-peer instead of routing through Daily's SFU —
          // one less media hop means lower latency and less re-encoding, which
          // in practice gives noticeably better video/audio quality for 1:1
          // calls when both sides have a workable direct connection. Daily
          // still falls back to a relay automatically if a direct P2P path
          // can't be established, so this doesn't trade away reliability.
          sfu_switchover: 2,
          enable_adaptive_simulcast: true,
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

/**
 * Creates a short-lived Daily.co meeting token scoping one user's join to
 * one room. Giving the teacher `isOwner: true` is what unlocks Daily
 * Prebuilt's built-in "mute this participant" control in its own
 * participant list — no custom call UI needed, it's a native owner
 * privilege (see Daily's meeting-token docs: owners "can perform
 * administrative actions like muting other participants").
 *
 * Returns null when DAILY_API_KEY isn't configured or `roomUrl` isn't a
 * real Daily room (e.g. the legacy Jitsi fallback) — SessionRoom then
 * just joins without a token, same as before this feature existed.
 */
export async function createMeetingToken(
  roomUrl: string,
  userName: string,
  isOwner: boolean
): Promise<string | null> {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey || !roomUrl.startsWith("http")) return null;

  const roomName = new URL(roomUrl).pathname.split("/").filter(Boolean).pop();
  if (!roomName) return null;

  try {
    const res = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          is_owner: isOwner,
          exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60, // 4h — generous for one session
        },
      }),
    });

    if (!res.ok) {
      console.error("Failed to create Daily.co meeting token:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.token || null;
  } catch (err) {
    console.error("Daily.co meeting token request failed:", err);
    return null;
  }
}
