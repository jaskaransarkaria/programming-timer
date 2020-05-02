export default class Websocket {
  constructor() {
    this.ws = new WebSocket(`ws://${process.env.ADDR}/ws`);
    this.ws.onopen = () => {
      console.log('successfully connected to the websocket');
      this.ws.send(sessionStorage.getItem('uuid'));
    };
    this.ws.onmessage = (event) => {
      console.log('message recieved', event);
    };
    this.ws.onclose = (event) => {
      console.log('socket closed connection', event);
    };
    this.ws.onerror = (error) => {
      console.log('Socket Error', error);
    };
  }
}

export function initWebsocket(onmessageConfig) {
  const ws = new WebSocket(`ws://${process.env.ADDR}/ws`);
  ws.onopen = () => {
    console.log('successfully connected to the websocket');
    ws.send(sessionStorage.getItem('uuid'));
  };
  ws.onmessage = onmessageConfig();
  ws.onclose = (event) => {
    console.log('socket closed connection', event);
  };
  ws.onerror = (error) => {
    console.log('Socket Error', error);
  };
  return ws;
}

export function closeWs(ws) {
  return ws.close();
}
