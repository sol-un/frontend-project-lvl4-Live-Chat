import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav, NavLink, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { changeCurrentChannelId } from '../slices/currentChannelId.js';
import { showModal } from '../slices/uiState.js';

const ChannelNav = () => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();

  const handleCurrentChannelChange = (id) => () => dispatch(changeCurrentChannelId(id));

  const handleNewChannelModal = () => dispatch(showModal({ type: 'adding', isVisible: true }));
  const handleRenameChannelModal = (channelId) => () => dispatch(showModal({
    type: 'renaming', isVisible: true, channelId,
  }));
  const handleDeleteChannelModal = (channelId) => () => dispatch(showModal({
    type: 'removing', isVisible: true, channelId,
  }));

  return (
    <>
      <div className="d-flex mb-2">
        <span>{t('channels')}</span>
        <button type="button" className="btn btn-link ml-auto p-0" onClick={handleNewChannelModal}>+</button>
      </div>
      <Nav variant="pills" className="flex-column nav-fill" as="ul">
        {channels.map(({ id, name, removable }) => (
          <Dropdown key={id} as={ButtonGroup}>
            <Button
              as={NavLink}
              className="text-left flex-grow-1 mb-2"
              onClick={handleCurrentChannelChange(id)}
              variant={id === currentChannelId ? 'primary' : 'light'}
            >
              {name}
            </Button>
            {removable && (
              <>
                <Dropdown.Toggle
                  split
                  className="flex-grow-0 mb-2"
                  variant={id === currentChannelId ? 'primary' : 'light'}
                  id="dropdown-split-basic"
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleRenameChannelModal(id)}>{t('rename')}</Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteChannelModal(id)}>{t('delete')}</Dropdown.Item>
                </Dropdown.Menu>
              </>
            )}
          </Dropdown>
        ))}
      </Nav>
    </>
  );
};

export default ChannelNav;
