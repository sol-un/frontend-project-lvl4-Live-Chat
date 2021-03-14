import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { deleteChannel } from '../slices/channelsSlice.js';

const DeleteChannelModal = ({ show, id, closeCurrentModal }) => {
  const cancelButton = React.useRef(null);
  const dispatch = useDispatch();
  return (
    <Modal
      show={show}
      onEntered={() => cancelButton.current.focus()}
      onHide={closeCurrentModal}
    >
      <Modal.Header>
        <Modal.Title>
          Delete channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center mb-2">
          The channel and all its messages will be irrevocably lost.
        </p>
        <p className="text-center mb-5">
          Are you sure?
        </p>
        <Formik
          initialValues={{ token: '' }}
          initialStatus={{ networkError: false }}
          onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
            dispatch(deleteChannel({ id }))
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
            status,
            isSubmitting,
            handleSubmit,
          }) => {
            const isNetworkError = status.networkError;
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <InputGroup>
                    <Button className="mx-auto" ref={cancelButton} variant="primary" onClick={closeCurrentModal}>Cancel</Button>
                    <Button className="mx-auto" variant="danger" type="submit" disabled={isSubmitting}>
                      Delete
                    </Button>
                  </InputGroup>
                  {isNetworkError && (
                    <Form.Text className="text-center text-danger mt-4">
                      Network error!
                    </Form.Text>
                  )}
                  {!isNetworkError && (
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

DeleteChannelModal.defaultProps = {
  id: null,
};

DeleteChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.number,
  closeCurrentModal: PropTypes.func.isRequired,
};

export default DeleteChannelModal;
