import React, { useContext, useEffect, useRef } from 'react';
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
  const { sendMessage } = useSocket();

  const messageSchema = yup.object().shape({
    message: yup.string().required(t('errors.required')),
  });

  const { username } = useContext(authContext);
  const currentChannelId = useSelector((state) => state.channelsInfo.currentChannelId);
  const inputField = useRef(null);

  useEffect(
    () => inputField.current.focus(),
    [currentChannelId],
  );

  return (
    <Formik
      initialValues={{ message: '' }}
      initialStatus={{ networkError: false }}
      validationSchema={messageSchema}
      validateOnBlur={false}
      onSubmit={({ message }, { resetForm, setStatus }) => {
        try {
          sendMessage({ username, message, channelId: currentChannelId });
          setStatus({ networkError: false });
          resetForm();
          inputField.current.focus();
        } catch (error) {
          setStatus({ networkError: true });
        }
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
          <div className="mt-auto">
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Label htmlFor="message" srOnly>{t('message')}</Form.Label>
                <Form.Control
                  className="rounded-left"
                  ref={inputField}
                  id="message"
                  type="text"
                  autoComplete="off"
                  value={values.message}
                  isInvalid={isNetworkError}
                  disabled={isSubmitting}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-testid="new-message"
                />
                <InputGroup.Append>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    {t('send')}
                  </Button>
                </InputGroup.Append>
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
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default MessageForm;
