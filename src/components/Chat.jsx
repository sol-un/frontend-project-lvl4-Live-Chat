import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row, Col,
} from 'react-bootstrap';
import ChannelNav from './ChannelNav.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import { hideModal } from '../slices/uiState.js';
import getModal from './modals/index.js';

const renderModal = ({ uiState, onHide }) => {
  if (!uiState.type) {
    return null;
  }

  const Component = getModal(uiState.type);
  return <Component modalInfo={uiState} onHide={onHide} />;
};

export default () => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.uiState);
  const onHide = () => dispatch(hideModal());
  return (
    <>
      {renderModal({ uiState, onHide })}
      <Row className="h-100 pb-3">
        <Col className="border-right" xs={3}>
          <ChannelNav />
        </Col>
        <Col className="d-flex flex-column justify-content-end h-100">
          <Messages />
          <MessageForm />
        </Col>
      </Row>
    </>
  );
};
