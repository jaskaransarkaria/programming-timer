export function initWebsocket(onmessageConfig) {
  let ws;
  try {
    ws = new WebSocket(`${process.env.PROD_WS}`);
    ws.onopen = () => {
      console.log('successfully connected to the websocket');
      ws.send(sessionStorage.getItem('uuid'));
    };
    ws.onmessage = (event) => onmessageConfig(event);
    ws.onclose = (event) => {
      console.log('socket closed connection', event);
    };
    ws.onerror = (error) => {
      console.log('Socket Error', error);
    };
    return ws;
  } catch (e) {
    console.error(e);
  }

}

export function closeWs(ws) {
  try {
    return ws.close();
  } catch (e) {
    console.error(e);
  }
}
