import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../hooks/index.jsx';
import { hideModal } from '../slices/modal.js';

const selectChannelNameById = (channelId) => (state) => state.channelsInfo.channels
  .find(({ id }) => id === channelId)
  ?.name;

const ModalHeader = ({ channelName, type, onHide }) => {
  const { t } = useTranslation();

  return (
    <Modal.Header closeButton onHide={onHide}>
      <Modal.Title>
        {t(`modals.${type}.header`, { channelName })}
      </Modal.Title>
    </Modal.Header>
  );
};

const ModalForm = ({
  type, event, onHide, channelId,
}) => {
  const { t } = useTranslation();

  const inputField = useRef(null);
  useEffect(() => inputField.current.focus());

  const channelNames = useSelector((state) => state.channelsInfo.channels
    .map(({ name }) => name));
  const channelNameSchema = yup.object().shape({
    name: yup.string()
      .required(t('errors.required'))
      .notOneOf(channelNames, t('errors.channelName')),
  });

  const channelName = useSelector(selectChannelNameById(channelId));

  return (
    <>
      <ModalHeader {...{ channelName, type, onHide }} />
      <Modal.Body>
        <Formik
          initialValues={{ name: channelName || '' }}
          initialStatus={{ networkError: false }}
          validationSchema={channelNameSchema}
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
                      disabled={isSubmitting}
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
      </Modal.Body>
    </>
  );
};

const Add = ({ type, onHide }) => {
  const { addChannel } = useSocket();
  return (
    <ModalForm {...{
      type, event: addChannel, onHide,
    }}
    />
  );
};

const Rename = ({ channelId, type, onHide }) => {
  const { renameChannel } = useSocket();

  return (
    <ModalForm {...{
      type, event: renameChannel, onHide, channelId,
    }}
    />
  );
};

const Remove = ({ channelId, type, onHide }) => {
  const { t } = useTranslation();
  const { removeChannel } = useSocket();

  const channelName = useSelector(selectChannelNameById(channelId));

  const cancelButton = useRef(null);
  useEffect(() => cancelButton.current.focus());

  return (
    <>
      <ModalHeader {...{ channelName, type, onHide }} />
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
                    <Button
                      className="mx-auto"
                      ref={cancelButton}
                      variant="primary"
                      disabled={isSubmitting}
                      onClick={onHide}
                    >
                      {t('modals.removing.cancel')}

                    </Button>
                    <Button
                      className="mx-auto"
                      variant="danger"
                      type="submit"
                      disabled={isSubmitting}
                    >
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
    </>
  );
};

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const ModalFactory = () => {
  const { isVisible, type, channelId } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  if (!type) {
    return null;
  }

  const onHide = () => dispatch(hideModal());

  const Component = modals[type];
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
    >
      <Component {...{ channelId, type, onHide }} />
    </Modal>
  );
};

export default ModalFactory;
