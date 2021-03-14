import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { createChannel } from '../slices/channelsSlice.js';

const NewChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  return (
    <Modal
      show={show}
      onHide={onHide}
    >
      <Modal.Header>
        <Modal.Title>
          Add channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ channelName: '' }}
          initialStatus={{ networkError: false }}
          validate={(values) => {
            const errors = {};
            if (values.channelName.length < 1) {
              errors.message = 'Channel name can\'t be empty!';
            }
            return errors;
          }}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
            dispatch(createChannel({
              name: values.channelName,
            }))
              .then(unwrapResult)
              .then(() => {
                setStatus({ networkError: false });
                resetForm();
                onHide();
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
                    <Form.Label htmlFor="channelName" srOnly>Channel name</Form.Label>
                    <Form.Control
                      id="channelName"
                      type="text"
                      className="mr-2"
                      placeholder="Enter channel name..."
                      value={values.channelName}
                      isInvalid={isNetworkError}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                      Submit
                    </Button>
                  </InputGroup>
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
                  {isValid && !isNetworkError && (
                    <div className="d-block">
                      &nbsp;
                    </div>
                  )}
                </Form.Group>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

NewChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default NewChannelModal;
