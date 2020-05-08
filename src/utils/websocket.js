export function initWebsocket(onmessageConfig) {
  const ws = new WebSocket(`wss://${process.env.ADDR}/ws`);
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
}

export function closeWs(ws) {
  return ws.close();
}
