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


export const getRoomStudents  = async (roomCode) => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms/${roomCode}/students`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to get room students");
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

export const getRoomApi = async (roomCode) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/rooms/${roomCode}`,
    {
      method: "GET",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get room");
  }

  return data;
};

export const joinRoomApi = async (roomCode, studentName) => {
  const res = await fetch(`${BASE_URL}/api/v1/participants/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomCode,
      nickname: studentName,
    }),
  });

  const data = await res.json();
  if (!res.ok) {

    if (data.data) {
      const firstError = Object.values(data.data)[0];
      throw new Error(firstError);
    }

    throw new Error(data.message || "Failed to join room");
  }

  return data;
};