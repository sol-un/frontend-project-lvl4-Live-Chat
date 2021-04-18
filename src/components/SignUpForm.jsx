import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const SignupSchema = yup.object().shape({
  username: yup.string().required('Обязательное поле').min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов'),
  password: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов'),
  confirmPassword: yup.string().required('Обязательное поле').test(
    'passwordNotConfirmed',
    'Пароли должны совпадать',
    (value, context) => value === context.parent.password,
  ),
});

export default () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const history = useHistory();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Formik
            initialValues={{
              username: '',
              password: '',
              confirmPassword: '',
            }}
            initialStatus={{ networkError: false }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              setSubmitting(false);
              setAuthFailed(false);
              try {
                const res = await axios.post(routes.signUpPath(), values);
                setStatus({ networkError: false });

                const { username, token } = res.data;
                localStorage.setItem('hexletChatUserId', JSON.stringify(token));
                auth.logIn(username);

                const { from } = { pathname: '/' };
                history.replace(from);
              } catch (err) {
                if (!err.response) {
                  setStatus({ networkError: true });
                  return;
                }
                if (err.isAxiosError && err.response.status === 409) {
                  setStatus({ networkError: false });
                  setAuthFailed(true);
                  inputRef.current.select();
                  return;
                }
                throw err;
              }
            }}
          >
            {(props) => {
              const {
                status,
                isSubmitting,
                errors,
                handleSubmit,
                handleChange,
              } = props;
              const isNetworkError = status.networkError;
              return (
                <Form className="p-3" onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                    <Form.Control
                      required
                      placeholder="От 3 до 20 символов"
                      onChange={handleChange}
                      id="username"
                      name="username"
                      ref={inputRef}
                      isInvalid={authFailed || errors.username}
                    />
                    {errors.username && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    <Form.Control
                      required
                      placeholder="Не менее 6 символов"
                      type="password"
                      onChange={handleChange}
                      id="password"
                      name="password"
                      isInvalid={authFailed || errors.password}
                    />
                    {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
                    <Form.Control
                      required
                      placeholder="Пароли должны совпадать"
                      type="password"
                      onChange={handleChange}
                      id="confirmPassword"
                      name="confirmPassword"
                      isInvalid={authFailed || errors.confirmPassword}
                    />
                    {errors.password && <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>}
                  </Form.Group>
                  {isNetworkError && (
                    <Form.Text className="text-danger">
                      Ошибка сети!
                    </Form.Text>
                  )}
                  <Button
                    className="w-100 mb-3"
                    type="submit"
                    variant="outline-primary"
                    disabled={isSubmitting}
                  >
                    Зарегистрироваться
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
