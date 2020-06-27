export async function checkPermissions() {
  try {
    switch (Notification.permission) {
    case 'default':
      return await Notification.requestPermission() ?
        'granted' :
        'denied';
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    }
  } catch (e) {
    console.error('Cannot access window.Notification');
  }
}

export function sendDriverNotification() {
  return new Notification('Times up!', {
    icon: '/favicon.png',
    body: 'You\'re the driver. Are you ready to start?',
    requireInteraction: true,
    vibrate: [
      200,
      100,
      200,
    ],
  });
}

export function sendNotification() {
  return new Notification('Times up!', {
    icon: '/favicon.png',
    body: 'Waiting for the driver to start the timer.',
    vibrate: [
      200,
      100,
      200,
    ],
  });
}
