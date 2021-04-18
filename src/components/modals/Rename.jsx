import React from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../../hooks/index.jsx';

export default ({ modalInfo, onHide }) => {
  const { channelId, channelName } = modalInfo;
  const socket = useSocket();

  const channels = useSelector((state) => state.channels);
  const channelNames = channels.map(({ name }) => name);
  const channelNameSchema = yup.object().shape({
    name: yup.string().required('Имя канала не должно быть пустым!').notOneOf(channelNames, 'Канал с таким именем уже существует.'),
  });

  const inputField = React.useRef(null);
  return (
    <Modal
      show
      onEntered={() => inputField.current.focus()}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{`Rename '${channelName}'`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          initialStatus={{ networkError: false }}
          validationSchema={channelNameSchema}
          validateOnBlur={false}
          onSubmit={({ name }, { setSubmitting, resetForm, setStatus }) => {
            if (socket.connected) {
              socket.emit('renameChannel', { name, id: channelId }, () => {
                setStatus({ networkError: false });
                resetForm();
                onHide();
              });
            } else {
              setStatus({ networkError: true });
            }
            setSubmitting(false);
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
                      placeholder="Enter channel name..."
                      value={values.name}
                      isInvalid={isNetworkError}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                      Create
                    </Button>
                  </InputGroup>
                  {errors.name && (
                    <Form.Text className="text-muted">
                      {errors.name}
                    </Form.Text>
                  )}
                  {isNetworkError && (
                    <Form.Text className="text-danger">
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
