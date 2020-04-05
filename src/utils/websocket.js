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

  socket.onmessage = () => {
    console.log('recieved from socket init');
  };

  return socket;
}