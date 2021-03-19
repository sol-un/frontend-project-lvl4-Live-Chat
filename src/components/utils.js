import { string } from 'yup';

const validateChannelName = (input, blocklist) => {
  const errorMessageDispatcher = {
    required: 'Channel name can\'t be empty!',
    notOneOf: 'This name is already taken by another channel.',
  };

  const schema = string()
    .required()
    .notOneOf(blocklist);

  try {
    schema.validateSync(input);
    return null;
  } catch (error) {
    const message = errorMessageDispatcher[error.type];
    return { message };
  }
};

const validateMessage = (input) => {
  const errorMessageDispatcher = {
    required: 'Message can\'t be empty!',
  };

  const schema = string()
    .required();

  try {
    schema.validateSync(input);
    return null;
  } catch (error) {
    const message = errorMessageDispatcher[error.type];
    return { message };
  }
};

export { validateChannelName, validateMessage };
