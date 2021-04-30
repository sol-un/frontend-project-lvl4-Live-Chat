import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../../hooks/index.jsx';

const Add = ({ onHide }) => {
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
        <Modal.Title>{t('modals.adding.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          initialStatus={{ networkError: false }}
          validationSchema={channelNameSchema}
          validateOnBlur={false}
          onSubmit={({ name }, { setSubmitting, resetForm, setStatus }) => {
            if (socket.connected) {
              socket.emit('newChannel', { name }, () => {
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
                    <Form.Label htmlFor="name" srOnly>{t('modals.adding.placeholder')}</Form.Label>
                    <Form.Control
                      ref={inputField}
                      id="name"
                      type="text"
                      className="mr-2"
                      placeholder={t('modals.adding.placeholder')}
                      value={values.name}
                      isInvalid={isNetworkError}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      data-testid="add-channel"
                    />
                    <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                      {t('modals.adding.create')}
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

export default Add;
