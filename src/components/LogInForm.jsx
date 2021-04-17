import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

export default () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const location = useLocation();
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
            }}
            initialStatus={{ networkError: false }}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              setSubmitting(false);
              setAuthFailed(false);
              try {
                const res = await axios.post(routes.loginPath(), values);
                setStatus({ networkError: false });

                const { username, token } = res.data;
                localStorage.setItem('hexletChatUserId', JSON.stringify(token));
                auth.logIn(username);

                const { from } = location.state || { from: { pathname: '/' } };
                history.replace(from);
              } catch (err) {
                if (!err.response) {
                  setStatus({ networkError: true });
                  return;
                }
                if (err.isAxiosError && err.response.status === 401) {
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
                status, isSubmitting, handleSubmit, handleChange,
              } = props;
              const isNetworkError = status.networkError;
              return (
                <Form className="p-3" onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label htmlFor="username">Ваш ник</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      id="username"
                      name="username"
                      ref={inputRef}
                      isInvalid={authFailed}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      onChange={handleChange}
                      id="password"
                      name="password"
                      isInvalid={authFailed}
                    />
                    <Form.Control.Feedback type="invalid">Неверные имя пользователя или пароль</Form.Control.Feedback>
                    {isNetworkError && (
                      <Form.Text className="text-danger">
                        Ошибка сети!
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button
                    className="w-100 mb-3"
                    type="submit"
                    variant="outline-primary"
                    disabled={isSubmitting}
                  >
                    Войти
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
