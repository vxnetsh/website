export interface Activity {
  type: number;
  state?: string;
  name: string;
  id: string;
  details?: string;
  created_at: number;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface LanyardData {
  spotify?: {
    song: string;
    artist: string;
    album_art_url: string;
    timestamps: {
      start: number;
      end: number;
    };
  };
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Activity[];
  listening_to_spotify: boolean;
}

export type Project = {
  name: string;
  description: string;
  icon?: string;
  url: string;
  type: "website" | "github";
};

export type Member = {
  name: string;
  link: string;
  github?: string;
  discord_id?: string;
  projects?: Project[];
};

const LANYARD_SOCKET_URL = "wss://lanyard.vmohammad.dev/socket";
const LANYARD_API_URL = "https://lanyard.vmohammad.dev/v1";

export class LanyardWebSocket {
  private ws: WebSocket | null = null;
  private heartbeat: NodeJS.Timeout | null = null;
  private subscribers = new Map<string, (data: LanyardData) => void>();

  constructor() {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(LANYARD_SOCKET_URL);

    this.ws.onopen = () => {
      this.ws?.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_ids: Array.from(this.subscribers.keys()) },
        }),
      );
    };

    this.ws.onmessage = ({ data }) => {
      const payload = JSON.parse(data);

      switch (payload.op) {
        case 1:
          this.heartbeat = setInterval(() => {
            this.ws?.send(JSON.stringify({ op: 3 }));
          }, payload.d.heartbeat_interval);
          break;
        case 0:
          if (
            (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") &&
            payload.d &&
            payload.d.discord_user &&
            payload.d.discord_user.id
          ) {
            const subscriber = this.subscribers.get(payload.d.discord_user.id);
            if (subscriber) subscriber(payload.d);
          }
          break;
      }
    };

    this.ws.onclose = () => {
      if (this.heartbeat) clearInterval(this.heartbeat);
      setTimeout(() => this.connect(), 1000);
    };
  }

  subscribe(discord_id: string, callback: (data: LanyardData) => void) {
    this.subscribers.set(discord_id, callback);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ op: 2, d: { subscribe_to_ids: [discord_id] } }),
      );
    }
  }

  unsubscribe(discord_id: string) {
    this.subscribers.delete(discord_id);
  }
}

export const getLanyardData = async (
  discord_id: string,
): Promise<LanyardData | null> => {
  try {
    const response = await fetch(`${LANYARD_API_URL}/users/${discord_id}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching Lanyard data:", error);
    return null;
  }
};
