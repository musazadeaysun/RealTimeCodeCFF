export const BASE_URL = "https://devroom-production.up.railway.app";

export const getLanguagesApi = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms/languages`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch languages");
  }

  return res.json();
};


export const getRoomApi = async (roomCode) => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms/${roomCode}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to get room");
  }

  return res.json();
};


export const createRoomApi = async (language) => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language }),
  });

  if (!res.ok) {
    throw new Error("Failed to create room");
  }

  return res.json();
};