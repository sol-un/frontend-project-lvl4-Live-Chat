import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Button, Row, Col,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { createMessage } from '../slices/messagesSlice.js';
import AppContext from '../app-context.js';

const MessageForm = () => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const userName = React.useContext(AppContext);
  return (
    <Formik
      initialValues={{ message: '' }}
      initialStatus={{ networkError: false }}
      validate={(values) => {
        const errors = {};
        if (values.message.length < 1) {
          errors.message = 'Message can\'t be empty!';
        }
        return errors;
      }}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
        dispatch(createMessage({
          text: values.message,
          userName,
          currentChannelId,
        }))
          .then(unwrapResult)
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
              <Row>
                <Col>
                  <Form.Label htmlFor="message">Your message:</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control
                    id="message"
                    type="text"
                    value={values.message}
                    isInvalid={isNetworkError}
                    placeholder="Enter your message..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {!isValid && (
                    <Form.Text className="text-muted">
                      {errors.message}
                    </Form.Text>
                  )}
                  {isNetworkError && (
                    <Form.Control.Feedback type="invalid">
                      Network error!
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col>
                  <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        );
      }}
    </Formik>
  );
};

export default MessageForm;
