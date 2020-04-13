import { minsToMillis } from './utils.js';


export async function joinSession(value) {
  return await fetch(`http://${process.env.ADDR}/session/join`, {
    method: 'POST',
    body: JSON.stringify({ joinSession: value }),
  });
}

export async function newSession(duration) {
  return await fetch(`http://${process.env.ADDR}/session/new`, {
    method: 'POST',
    body: JSON.stringify({
      duration: parseInt(minsToMillis(duration), 10),
      startTime: Date.now(),
    }),
  });
}
