import React from 'react';
import { useSelector } from 'react-redux';
import {
  Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { validateMessage } from './utils.js';

const MessageForm = () => {
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const userName = 'token';
  return (
    <Formik
      initialValues={{ message: '' }}
      initialStatus={{ networkError: false }}
      validate={(values) => validateMessage(values.message)}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
        const data = {
          attributes: {
            text: values.message,
            userName,
          },
        };
        return axios({
          method: 'post',
          url: routes.channelMessagesPath(currentChannelId),
          data: { data },
        })
          .then(() => {
            setStatus({ networkError: false });
            resetForm();
          })
          .catch(() => setStatus({ networkError: true }))
          .finally(() => setSubmitting(false));
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
                <Form.Label htmlFor="message" srOnly>Your message</Form.Label>
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
                  Submit
                </Button>
              </InputGroup>
              {!isValid && (
                <Form.Text className="text-muted">
                  {errors.message}
                </Form.Text>
              )}
              {isNetworkError && (
                <Form.Text className="text-danger">
                  Network error!
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
