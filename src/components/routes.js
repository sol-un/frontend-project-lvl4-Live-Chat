const host = '';

export default {
  rootPath: () => '/',
  noMatchPath: () => '*',
  signUpPath: () => [host, 'signup'].join('/'),
  logInPath: () => [host, 'login'].join('/'),
};
