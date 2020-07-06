function playNotificationSound(notifySound) {
  notifySound.play();
}

export async function checkPermissions() {
  try {
    switch (Notification.permission) {
    case 'default':
      return (await Notification.requestPermission()) ?
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

export function sendDriverNotification(notifySound) {
  playNotificationSound(notifySound);
  return new Notification(
    'Times up as the driver, it\'s somebody else\'s turn!',
    {
      icon: '/favicon.png',
      body: 'Click me to start the timer again.',
      requireInteraction: true,
      vibrate: [
        200,
        100,
        200,
      ],
    },
  );
}

export function sendNotification(notifySound) {
  playNotificationSound(notifySound);
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

export function newDriverNotification(newDriverSound) {
  newDriverSound.play();
  return new Notification('You\'re the new driver!', {
    icon: '/favicon.png',
    vibrate: [
      200,
      100,
      200,
    ],
  });
}
