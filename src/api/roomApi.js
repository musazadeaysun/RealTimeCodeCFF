


export const BASE_URL = "https://devroom-production-032d.up.railway.app";

// Languages
export const getLanguagesApi = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms/languages`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch languages");
  }

  return res.json();
};

// Room yarat
export const createRoomApi = async (language) => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to create room");
  }

  return data;
};

// Otaq məlumatı
export const getRoomApi = async (roomCode) => {
  const res = await fetch(`${BASE_URL}/api/v1/rooms/${roomCode}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get room");
  }

  return data;
};

// Otaq şagirdləri
export const getRoomStudents = async (roomCode) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/participants/room/${roomCode}`  // ← düzgün endpoint
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get room students");
  }

  return data;
};

// Otağa qoşul
export const joinRoomApi = async (roomCode, studentName) => {
  const res = await fetch(`${BASE_URL}/api/v1/participants/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomCode, nickname: studentName }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Validation xətası olduqda ilk field xətasını göstər
    const firstError =
      data?.data && typeof data.data === "object"
        ? Object.values(data.data)[0]
        : null;

    throw new Error(firstError || data?.message || "Failed to join room");
  }

  return data;
};

// Kod run et
export const runCodeApi = async ({ participantId, roomCode, code }) => {
  const res = await fetch(`${BASE_URL}/api/v1/executions/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantId, roomCode, code }),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data?.message || "Execution failed");
  }

  return data;
};

// Otaq run tarixçəsi
export const getRoomHistoryApi = async (roomCode) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/executions/history/room/${roomCode}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch history");
  }

  return data;
};

// Şagird run tarixçəsi
export const getStudentHistoryApi = async (participantId, roomCode) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/executions/history/participant/${participantId}?roomCode=${roomCode}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch student history");
  }

  return data;
};

