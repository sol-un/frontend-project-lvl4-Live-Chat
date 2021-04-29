import React, { useRef } from 'react';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useSocket } from '../../hooks/index.jsx';

export default ({ modalInfo, onHide }) => {
  const { channelId, channelName } = modalInfo;
  const { t } = useTranslation();
  const socket = useSocket();
  const cancelButton = useRef(null);
  return (
    <Modal
      show
      onEntered={() => cancelButton.current.focus()}
      onHide={onHide}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('modals.removing.header', { channelName })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center mb-2">
          {t('modals.removing.body.line1', { channelName })}
        </p>
        <p className="text-center mb-5">
          {t('modals.removing.body.line2')}
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
                    <Button className="mx-auto" ref={cancelButton} variant="primary" onClick={onHide}>{t('modals.removing.cancel')}</Button>
                    <Button className="mx-auto" variant="danger" type="submit" disabled={isSubmitting}>
                      {t('modals.removing.remove', { channelName })}
                    </Button>
                  </InputGroup>
                  {isNetworkError && (
                    <Form.Text className="text-center text-danger mt-4">
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
