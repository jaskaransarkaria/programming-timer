import { checkPermissions } from '../../src/utils/notification.js';

describe('how notifications are initialised and pushed', () => {
  it('when permission is default, prompt the user for permission to display notifications',
    async () => {
      global.Notification = {
        requestPermission: jest.fn(),
        permission: 'default',
      };
      const notificationSpy = jest.spyOn(global.Notification, 'requestPermission');
      await checkPermissions();
      expect(notificationSpy).toBeCalled();
    });

  it('when asked permission is denied display "what\'s the point?" page', async () => {
    global.Notification = {
      requestPermission: jest.fn(),
      permission: 'denied',
    };
    const result = await checkPermissions();
    expect(result).toBe('denied');
  });

  it('when permision is granted show the timer', async () => {
    global.Notification = {
      requestPermission: jest.fn(),
      permission: 'granted',
    };
    const result = await checkPermissions();
    expect(result).toBe('granted');
  });

  it.skip('When the timer finishes notify the new driver to restart the timer', () => {});
  it.skip('when the timer finishes and user is not the driver, notify' +
  'them that the next session will restart when the driver is ready', () => {});
});
