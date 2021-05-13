import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const SignUpForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const history = useHistory();
  const inputRef = useRef();

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .required(t('errors.required'))
      .min(3, `${t('errors.signup.username')}!`)
      .max(20, `${t('errors.signup.username')}!`),
    password: yup.string()
      .required(t('errors.required'))
      .min(6, `${t('errors.signup.password')}!`),
    confirmPassword: yup.string()
      .required(t('errors.required'))
      .test(
        'passwordNotConfirmed',
        `${t('errors.signup.confirmPassword')}!`,
        (value, context) => value === context.parent.password,
      ),
  });

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
            onSubmit={async (values, { setStatus }) => {
              setAuthFailed(false);
              try {
                const res = await axios.post(routes.signUpPath(), values);
                setStatus({ networkError: false });

                const { username, token } = res.data;
                auth.saveUserId(token);
                auth.logIn(username);

                const { from } = { pathname: '/' };
                history.replace(from);
              } catch (err) {
                if (!err.response) {
                  setStatus({ networkError: true });
                  return;
                }
                if (!err.isAxiosError || !err.response.status === 409) {
                  throw err;
                }
                setStatus({ networkError: false });
                setAuthFailed(true);
                inputRef.current.select();
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
                    <Form.Label htmlFor="username">{t('newUserName')}</Form.Label>
                    <Form.Control
                      required
                      placeholder={t('errors.signup.username')}
                      onChange={handleChange}
                      id="username"
                      name="username"
                      ref={inputRef}
                      isInvalid={authFailed || errors.username}
                    />
                    {errors.username && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">{t('password')}</Form.Label>
                    <Form.Control
                      required
                      placeholder={t('errors.signup.password')}
                      type="password"
                      onChange={handleChange}
                      id="password"
                      name="password"
                      isInvalid={authFailed || errors.password}
                    />
                    {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="confirmPassword">{t('confirmPassword')}</Form.Label>
                    <Form.Control
                      required
                      placeholder={t('errors.signup.confirmPassword')}
                      type="password"
                      onChange={handleChange}
                      id="confirmPassword"
                      name="confirmPassword"
                      isInvalid={authFailed || errors.confirmPassword}
                    />
                    {errors.confirmPassword && <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>}
                  </Form.Group>
                  {isNetworkError && (
                    <Form.Text className="text-danger">
                      {t('errors.network')}
                    </Form.Text>
                  )}
                  <Button
                    className="w-100 mb-3"
                    type="submit"
                    variant="outline-primary"
                    disabled={isSubmitting}
                  >
                    {t('signupButton')}
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

export default SignUpForm;
