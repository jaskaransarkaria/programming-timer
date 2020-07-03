import { minsToMillis } from './utils.js';


export async function joinSession(value) {
  const response = await fetch(`${process.env.ADDR}/session/join`, {
    method: 'POST',
    body: JSON.stringify({ joinSession: value }),
  });
  return await response.json();
}

export async function updateSession(value) {
  await fetch(`${process.env.ADDR}/session/update`, {
    method: 'POST',
    body: JSON.stringify( value ),
  });
}

export async function newSession(duration) {
  const response = await fetch(`${process.env.ADDR}/session/new`, {
    method: 'POST',
    body: JSON.stringify({
      duration: parseInt(minsToMillis(duration), 10),
      startTime: Date.now(),
    }),
  });
  return await response.json();
}
