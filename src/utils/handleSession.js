import { minsToMillis } from './utils.js';


export async function joinSession(value) {
  const response = await fetch(`${process.env.ADDR}/session/join`, {
    method: 'POST',
    body: JSON.stringify({ joinSession: value }),
  });
  return await response.json();
}

export async function updateSession({ SessionID, UpdatedDuration = undefined }) {
  await fetch(`${process.env.ADDR}/session/update`, {
    method: 'POST',
    body: JSON.stringify( {
      sessionId: SessionID,
      updatedDuration: UpdatedDuration,
    } ),
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

export async function pauseSession(sessionID, pauseTime){
  await fetch(`${process.env.ADDR}/session/pause`, {
    method: 'POST',
    body: JSON.stringify( {
      sessionId: sessionID,
      pauseTime: pauseTime,
    }),
  });
}

export async function unpauseSession(sessionID, unpauseTime){
  console.log(sessionID)
  await fetch(`${process.env.ADDR}/session/unpause`, {
    method: 'POST',
    body: JSON.stringify( {
      sessionId: sessionID,
      unpauseTime: unpauseTime,
    }),
  });
}