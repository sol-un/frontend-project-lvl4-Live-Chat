// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  loginPath: () => [host, prefix, 'login'].join('/'),
  signUpPath: () => [host, prefix, 'signup'].join('/'),
  dataPath: () => [host, prefix, 'data'].join('/'),
};
