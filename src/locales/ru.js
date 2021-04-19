export default {
  translation: {
    login: 'Войти',
    logout: 'Выйти',
    signup: 'Регистрация',
    username: 'Ваш ник',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    noAccount: 'Нет аккаунта?',
    channels: 'Каналы',
    message: 'Ваше сообщение',
    send: 'Отправить',
    modals: {
      adding: {
        header: 'Добавить канал',
        placeholder: 'Введите имя канала',
        create: 'Отправить',
      },
      removing: {
        header: 'Удалить канал',
        body: {
          line1: 'Канал \'{{channelName}}\' будет окончательно удален вместе со всем содержимым.',
          line2: 'Уверены?',
        },
        cancel: 'Отменить',
        remove: 'Удалить \'{{channelName}}\'',
      },
      renaming: {
        header: 'Переименовать \'{{channelName}}\'',
        placeholder: 'Enter a new name for \'{{channelName}}\'',
        rename: 'Отправить',
      },
    },
    errors: {
      required: 'Обязательное поле',
      login: 'Неверные имя пользователя или пароль!',
      network: 'Ошибка соединения!',
      signup: {
        username: 'От 3 до 20 символов',
        password: 'Не менее 6 символовs',
        confirmPassword: 'Пароли должны совпадать',
      },
      404: 'Ошибка 404 – страница не найдена!',
      channelName: 'Должно быть уникальным!',
    },
  },
};
