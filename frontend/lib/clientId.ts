export function getClientId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let clientId = localStorage.getItem("clientId");

  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
  }

  return clientId;
}