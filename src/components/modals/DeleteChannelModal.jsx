import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { deleteChannel } from '../../slices/channelsSlice.js';

const DeleteChannelModal = ({
  show, id, channelName, closeCurrentModal,
}) => {
  const cancelButton = React.useRef(null);
  const dispatch = useDispatch();
  return (
    <Modal
      show={show}
      onEntered={() => cancelButton.current.focus()}
      onHide={closeCurrentModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {`Delete '${channelName}'`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center mb-2">
          {`The channel '${channelName}' and all its contents will be lost forever.`}
        </p>
        <p className="text-center mb-5">
          Are you sure?
        </p>
        <Formik
          initialValues={{}}
          initialStatus={{ networkError: false }}
          onSubmit={(_values, { setSubmitting, resetForm, setStatus }) => {
            dispatch(deleteChannel({ id }))
              .then(unwrapResult)
              .then(() => {
                closeCurrentModal();
                setStatus({ networkError: false });
              })
              .catch(() => setStatus({ networkError: true }))
              .finally(() => {
                setSubmitting(false);
              });
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
                      {`Delete '${channelName}'`}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-center text-danger mt-4">
                    {isNetworkError && 'Network error!'}
                  </Form.Text>
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
  channelName: '',
};

DeleteChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.number,
  channelName: PropTypes.string,
  closeCurrentModal: PropTypes.func.isRequired,
};

export default DeleteChannelModal;
