import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav, NavLink, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { changeCurrentChannelId } from '../slices/currentChannelId.js';

const ChannelNav = () => {
  const channels = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();

  const handleCurrentChannelChange = (id) => () => dispatch(changeCurrentChannelId(id));

  const handleNewChannelModal = () => console.log('New channel');
  const handleRenameChannelModal = (id, channelName) => () => console.log(`Rename ${channelName}`);
  const handleDeleteChannelModal = (id, channelName) => () => console.log(`Delete ${channelName}`);

  return (
    <>
      <div className="d-flex mb-2">
        <span>Каналы</span>
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
                  <Dropdown.Item onClick={handleRenameChannelModal(id, name)}>Rename</Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteChannelModal(id, name)}>Delete</Dropdown.Item>
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
