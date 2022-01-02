  import {
    updateSession,
  } from './handleSession.js';

import {
  sendDriverNotification,
  sendNotification,
  newDriverNotification,
} from './notification.js';

const notifySound = new Audio('/deduction.mp3');

/**
 * Calculate and display remaining time MS
 * for a pre-existing session
 *
 * @param {object} existingSessionData
 */
export function calculateRemainingTime(existingSessionData) {
  const endTime = existingSessionData.EndTime;
  const remainingTimeMillis = endTime - Date.now();
  displayRemainingTime(remainingTimeMillis);
}

/**
 * Handle when the timer has finished:
 * update the server with session data,
 * show relevant notification
 */
export function timesUp(uuid, sessionData) {
  if (
    'CurrentDriver' in sessionData &&
    'UUID' in sessionData.CurrentDriver
  ) {
    if (uuid === sessionData.CurrentDriver.UUID && !(Number.isInteger(displayTime))) {
      showReset = true;
      const notification = sendDriverNotification(notifySound);
      notification.onclick = () => {
        updateSession(sessionData);
        notification.close();
      };
    } else {
      sendNotification(notifySound);
    }
  }
  return 'Time\'s up'
}
