import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../hooks/index.jsx';

const getSchema = () => {
  const { t } = useTranslation(); // eslint-disable-line react-hooks/rules-of-hooks
  const channels = useSelector((state) => state.channels); // eslint-disable-line react-hooks/rules-of-hooks, max-len
  const channelNames = channels.map(({ name }) => name);
  return yup.object().shape({
    name: yup.string()
      .required(t('errors.required'))
      .notOneOf(channelNames, t('errors.channelName')),
  });
};

const getChannelName = (channelId) => {
  if (!channelId) {
    return null;
  }
  const channel = useSelector((state) => state.channels // eslint-disable-line react-hooks/rules-of-hooks, max-len
    .find(({ id }) => id === channelId));
  return channel.name;
};

const ModalHeader = ({ channelId, type, onHide }) => {
  const { t } = useTranslation();
  return (
    <Modal.Header closeButton onHide={onHide}>
      <Modal.Title>
        {t(`modals.${type}.header`, { channelName: getChannelName(channelId) })}
      </Modal.Title>
    </Modal.Header>
  );
};

const ModalForm = ({
  type, event, onHide, inputField, channelId,
}) => {
  const { t } = useTranslation();
  const channelName = getChannelName(channelId);
  return (
    <Formik
      initialValues={{ name: channelName || '' }}
      initialStatus={{ networkError: false }}
      validationSchema={getSchema()}
      validateOnBlur={false}
      onSubmit={({ name }, { resetForm, setStatus }) => {
        try {
          event({ name, id: channelId });
          setStatus({ networkError: false });
          onHide();
          resetForm();
        } catch (error) {
          setStatus({ networkError: true });
        }
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
                <Form.Label htmlFor="name" srOnly>{t(`modals.${type}.placeholder`, { channelName })}</Form.Label>
                <Form.Control
                  ref={inputField}
                  id="name"
                  type="text"
                  className="mr-2"
                  placeholder={t(`modals.${type}.placeholder`, { channelName })}
                  value={values.name}
                  isInvalid={isNetworkError}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-testid="add-channel"
                />
                <Button variant="primary" type="submit" disabled={!isValid || isSubmitting}>
                  {t(`modals.${type}.button`)}
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
  );
};

const Add = ({ channelId, type, onHide }) => {
  const { addChannel } = useSocket();
  const inputField = useRef(null);
  return (
    <Modal
      show
      onEntered={() => inputField.current.focus()}
      onHide={onHide}
    >
      {ModalHeader({ channelId, type, onHide })}
      <Modal.Body>
        {ModalForm({
          type, event: addChannel, onHide, inputField, channelId,
        })}
      </Modal.Body>
    </Modal>
  );
};

const Rename = ({ channelId, type, onHide }) => {
  const { renameChannel } = useSocket();

  const inputField = useRef(null);
  return (
    <Modal
      show
      onEntered={() => inputField.current.focus()}
      onHide={onHide}
    >
      {ModalHeader({ channelId, type, onHide })}
      <Modal.Body>
        {ModalForm({
          type, event: renameChannel, onHide, inputField, channelId,
        })}
      </Modal.Body>
    </Modal>
  );
};

const Remove = ({ channelId, type, onHide }) => {
  const { t } = useTranslation();
  const { removeChannel } = useSocket();

  const channelName = getChannelName(channelId);
  const cancelButton = useRef(null);
  return (
    <Modal
      show
      onEntered={() => cancelButton.current.focus()}
      onHide={onHide}
    >
      {ModalHeader({ channelId, type, onHide })}
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
          onSubmit={(_values, { setStatus }) => {
            try {
              removeChannel({ id: channelId });
              setStatus({ networkError: false });
              onHide();
            } catch (error) {
              setStatus({ networkError: true });
            }
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

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const getModal = (modalName) => modals[modalName];

const ModalFactory = ({ uiState, onHide }) => {
  if (!uiState.isVisible) {
    return null;
  }

  const Component = getModal(uiState.type);
  return <Component channelId={uiState.channelId} type={uiState.type} onHide={onHide} />;
};

export default ModalFactory;
