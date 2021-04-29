import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../../hooks/index.jsx';

export default ({ modalInfo, onHide }) => {
  const { channelId, channelName } = modalInfo;
  const { t } = useTranslation();
  const socket = useSocket();

  const channels = useSelector((state) => state.channels);
  const channelNames = channels.map(({ name }) => name);
  const channelNameSchema = yup.object().shape({
    name: yup.string().required(t('errors.required')).notOneOf(channelNames, t('errors.channelName')),
  });

  const inputField = useRef(null);
  return (
    <Modal
      show
      onEntered={() => inputField.current.focus()}
      onHide={onHide}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.renaming.header', { channelName })}</Modal.Title>
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
                    <Form.Label htmlFor="name" srOnly>{t('modals.renaming.placeholder', { channelName })}</Form.Label>
                    <Form.Control
                      ref={inputField}
                      id="name"
                      type="text"
                      className="mr-2"
                      placeholder={channelName}
                      value={values.name}
                      isInvalid={isNetworkError}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                      {t('modals.renaming.rename')}
                    </Button>
                  </InputGroup>
                  {errors.name && (
                    <Form.Text className="text-muted">
                      {errors.name}
                    </Form.Text>
                  )}
                  {isNetworkError && (
                    <Form.Text className="text-danger">
                      {t('errors.network')}
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
