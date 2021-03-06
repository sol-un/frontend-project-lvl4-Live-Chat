export default {
  translation: {
    login: 'Log in',
    logout: 'Log out',
    signupLink: 'Sign up',
    signupButton: 'Sign up',
    username: 'Username',
    newUserName: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    noAccount: 'Don\'t have an account?',
    channels: 'Channels',
    rename: 'Rename',
    delete: 'Delete',
    message: 'Your message',
    send: 'Send',
    modals: {
      adding: {
        header: 'Add channel',
        placeholder: 'Enter channel name',
        button: 'Create',
      },
      removing: {
        header: 'Remove \'{{channelName}}\'',
        body: {
          line1: 'The channel \'{{channelName}}\' and all its contents will be lost forever.',
          line2: 'Are you sure?',
        },
        cancel: 'Cancel',
        remove: 'Remove \'{{channelName}}\'',
      },
      renaming: {
        header: 'Rename \'{{channelName}}\'',
        placeholder: 'Enter a new name for \'{{channelName}}\'',
        button: 'Rename',
      },
    },
    errors: {
      required: 'Can\'t be empty!',
      login: 'Incorrect Username or Password!',
      network: 'Connection error!',
      signup: {
        username: 'From 3 to 20 characters',
        password: 'At least 6 characters',
        confirmPassword: 'Must be identical to Password',
      },
      404: 'Error 404 – Page Not Found!',
      channelName: 'This name is already taken by another channel!',
    },
  },
};
