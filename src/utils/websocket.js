export function initWebsocket(addr) {

  const socket = new WebSocket(`ws://${addr}/ws`);

  console.log('attempting websocket connection');

  socket.onopen = () => {
    console.log('successfully connected to the websocket');
    socket.send('Hi from Svelte');
  };

  socket.onclose = (event) => {
    console.log('socket closed connection', event);
  };

  socket.onerror = (error) => {
    console.log('Socket Error', error);
  };

  return socket;
}

export async function sendAndListenToExistingSession(ws, payload) {
  let existingSessionData;
  await ws.send(JSON.stringify({ joinSession: payload }));
  ws.onmessage = (msg) => {
    try {
      existingSessionData = JSON.parse(msg.data);
    } catch (err) {
      console.log('data is not json', err);
      console.log(msg.data);
    }
  };
  return existingSessionData;
}
