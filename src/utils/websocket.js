export function initWebsocket() {
  let socket = false;
  try {
    socket = new WebSocket(`ws://${process.env.ADDR}/ws`);
    console.log("attempting websocket connection");

    socket.onopen = () => {
      console.log("successfully connected to the websocket");
      socket.send("Hi from Svelte");
    };

    socket.onclose = (event) => {
      console.log("socket closed connection", event);
    };

    socket.onerror = (error) => {
      console.log("Socket Error", error);
    };
  } catch (err) {
    console.log("initWebsocket", err);
  }
  return socket;
}

export async function sendAndListenToExistingSession(ws, payload) {
  let existingSessionData;
  try {
    await ws.send(JSON.stringify({ joinSession: payload }));
    ws.onmessage = (msg) => {
      try {
        existingSessionData = JSON.parse(msg.data);
      } catch (err) {
        console.log("data is not json", err);
        console.log(msg.data);
      }
    };
  } catch (err) {
    console.log("sendAndListenToExistingSession", err);
  }
  return existingSessionData;
}

export async function sendStartTimer(ws, payload) {
  try {
    await ws.send(
      JSON.stringify({
        duration: payload,
        startTime: Date.now(),
      })
    );
  } catch (err) {
    console.log("sendStartTimer", err);
  }
}

export function listenForWebSockMsg(ws) {
  let sessionData;
  ws.onmessage = (msg) => {
    try {
      sessionData = JSON.parse(msg.data);
    } catch (err) {
      console.log("listenForWebSockMsg -- data is not json", err);
      console.log(msg.data);
    }
  };
  return sessionData;
}
