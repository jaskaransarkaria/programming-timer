import page from 'page.js';

export default function initRouter() {
  let path;
  // setup the timer with the correct session details
  // eslint-disable-next-line prefer-destructuring
  page('/[A-Za-z0-9]{4}', (ctx) => { path = ctx.path; });
  page('*', () => page.redirect('/')); // clean url (If not recognised it directs home)
  page.start();
  return path;
}
