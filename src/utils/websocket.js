export function initWebsocket() {
  let socket = false;
  try {
    socket = new WebSocket(`ws://${process.env.ADDR}/ws`);
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
  } catch (err) {
    console.log('initWebsocket', err);
  }
  return socket;
}
