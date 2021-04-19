import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../hooks/index.jsx';
import { authContext } from '../contexts/index.jsx';

const MessageForm = () => {
  const { t } = useTranslation();

  const messageSchema = yup.object().shape({
    message: yup.string().required(t('errors.required')),
  });

  const { username } = useContext(authContext);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const socket = useSocket();
  return (
    <Formik
      initialValues={{ message: '' }}
      initialStatus={{ networkError: false }}
      validationSchema={messageSchema}
      validateOnBlur={false}
      onSubmit={({ message }, { setSubmitting, resetForm, setStatus }) => {
        if (socket.connected) {
          socket.emit('newMessage', { username, message, channelId: currentChannelId }, () => {
            setStatus({ networkError: false });
            resetForm();
          });
        } else {
          setStatus({ networkError: true });
        }
        setSubmitting(false);
      }}
    >
      {(props) => {
        const {
          values,
          errors,
          status,
          isSubmitting,
          isValid,
          handleChange,
          handleSubmit,
          handleBlur,
        } = props;
        const isNetworkError = status.networkError;
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <InputGroup>
                <Form.Label htmlFor="message" srOnly>{t('message')}</Form.Label>
                <Form.Control
                  id="message"
                  aria-label="message"
                  type="text"
                  autoComplete="off"
                  className="mr-2"
                  value={values.message}
                  isInvalid={isNetworkError}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Button
                  aria-label="submit"
                  variant="primary"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {t('send')}
                </Button>
              </InputGroup>
              {errors.message && (
                <Form.Text className="text-muted">
                  {errors.message}
                </Form.Text>
              )}
              {isNetworkError && (
                <Form.Text className="text-danger">
                  {t('errors.network')}
                </Form.Text>
              )}
              {isValid && !isNetworkError && (
                <Form.Text>
                  &nbsp;
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        );
      }}
    </Formik>
  );
};

export default MessageForm;
