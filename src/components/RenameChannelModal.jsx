import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateChannelName } from '../slices/channelsSlice.js';

const RenameChannelModal = ({ show, id, closeCurrentModal }) => {
  const inputField = React.useRef(null);
  const dispatch = useDispatch();
  return (
    <Modal
      show={show}
      onEntered={() => inputField.current.focus()}
      onHide={closeCurrentModal}
    >
      <Modal.Header>
        <Modal.Title>
          Rename channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          initialStatus={{ networkError: false }}
          validate={(values) => {
            const errors = {};
            if (values.name.length < 1) {
              errors.message = 'Channel name can\'t be empty!';
            }
            return errors;
          }}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
            dispatch(updateChannelName({
              name: values.name,
              id,
            }))
              .then(unwrapResult)
              .then(() => {
                setStatus({ networkError: false });
                resetForm();
                closeCurrentModal();
              })
              .catch(() => setStatus({ networkError: true }))
              .finally(() => setSubmitting(false));
          }}
        >
          {({
            values,
            errors,
            status,
            isSubmitting,
            isValid,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => {
            const isNetworkError = status.networkError;
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <InputGroup>
                    <Form.Label htmlFor="name" srOnly>Channel name</Form.Label>
                    <Form.Control
                      ref={inputField}
                      id="name"
                      type="text"
                      className="mr-2"
                      placeholder="Enter new channel name..."
                      value={values.name}
                      isInvalid={isNetworkError}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                      Rename
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

RenameChannelModal.defaultProps = {
  id: null,
};

RenameChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.number,
  closeCurrentModal: PropTypes.func.isRequired,
};

export default RenameChannelModal;