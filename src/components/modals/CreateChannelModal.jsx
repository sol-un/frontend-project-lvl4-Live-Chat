import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Modal, Form, Button, InputGroup,
} from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import routes from '../../routes.js';
import { validateChannelName } from '../../utils.js';

const CreateChannelModal = ({ show, closeCurrentModal }) => {
  const channels = useSelector((state) => state.channels);
  const channelNames = channels.map(({ name }) => name);
  const inputField = React.useRef(null);
  return (
    <Modal
      show={show}
      onEntered={() => inputField.current.focus()}
      onHide={closeCurrentModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          New channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          initialStatus={{ networkError: false }}
          validate={(values) => validateChannelName(values.name, channelNames)}
          validateOnBlur={false}
          onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
            const data = {
              attributes: {
                name: values.name,
              },
            };
            return axios({
              method: 'post',
              url: routes.channelsPath(),
              data: { data },
            })
              .then(() => {
                closeCurrentModal();
                resetForm();
                setStatus({ networkError: false });
              })
              .catch(() => setStatus({ networkError: true }))
              .finally(() => {
                setSubmitting(false);
              });
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
                </Form.Group>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

CreateChannelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeCurrentModal: PropTypes.func.isRequired,
};

export default CreateChannelModal;
