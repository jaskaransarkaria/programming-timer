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
});
