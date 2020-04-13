export class Websocket {
  constructor() {
    this.ws = new WebSocket(`ws://${process.env.ADDR}/ws`);
    this.ws.onopen = () => {
      console.log('successfully connected to the websocket');
      this.ws.send('Hi from Svelte');
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
