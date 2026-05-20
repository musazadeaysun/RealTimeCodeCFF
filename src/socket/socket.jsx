import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BASE_URL } from "../api/roomApi";

const SOCKET_URL = `${BASE_URL}/ws-devroom`;

export const stompClient = new Client({
  webSocketFactory: () => new SockJS(SOCKET_URL),
   reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
});