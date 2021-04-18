import React from 'react';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useSocket } from '../../hooks/index.jsx';

export default ({ modalInfo, onHide }) => {
  const { channelId, channelName } = modalInfo;
  const socket = useSocket();
  const cancelButton = React.useRef(null);
  return (
    <Modal
      show
      onEntered={() => cancelButton.current.focus()}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {`Remove '${channelName}'`}
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
          onSubmit={(_values, { setSubmitting, setStatus }) => {
            if (socket.connected) {
              socket.emit('removeChannel', { id: channelId }, () => {
                setStatus({ networkError: false });
                onHide();
              });
            } else {
              setStatus({ networkError: true });
            }
            setSubmitting(false);
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
                    <Button className="mx-auto" ref={cancelButton} variant="primary" onClick={onHide}>Cancel</Button>
                    <Button className="mx-auto" variant="danger" type="submit" disabled={isSubmitting}>
                      {`Delete '${channelName}'`}
                    </Button>
                  </InputGroup>
                  {isNetworkError && (
                    <Form.Text className="text-center text-danger mt-4">
                      Network error!
                    </Form.Text>
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
