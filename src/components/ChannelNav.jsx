import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav, NavLink, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { changeCurrentChannelId } from '../slices/currentChannelIdSlice.js';
import CreateChannelModal from './CreateChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';
import DeleteChannelModal from './DeleteChannelModal.jsx';

const ChannelNav = () => {
  const [currentModalData, setCurrentModalData] = React.useState({ name: null, id: null });
  const channels = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();

  const handleCurrentChannelChange = (id) => () => dispatch(changeCurrentChannelId(id));

  const handleNewChannelModal = () => setCurrentModalData({ name: 'new', id: null });
  const handleRenameChannelModal = (id) => () => setCurrentModalData({ name: 'rename', id });
  const handleDeleteChannelModal = (id) => () => setCurrentModalData({ name: 'delete', id });
  const closeCurrentModal = () => setCurrentModalData({ name: null, id: null });

  return (
    <>
      <CreateChannelModal
        show={currentModalData.name === 'new'}
        closeCurrentModal={closeCurrentModal}
      />
      <RenameChannelModal
        show={currentModalData.name === 'rename'}
        id={currentModalData.id}
        closeCurrentModal={closeCurrentModal}
      />
      <DeleteChannelModal
        show={currentModalData.name === 'delete'}
        id={currentModalData.id}
        closeCurrentModal={closeCurrentModal}
      />
      <div className="d-flex mb-2">
        <span>Channels</span>
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
                  <Dropdown.Item onClick={handleRenameChannelModal(id)}>Rename</Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteChannelModal(id)}>Remove</Dropdown.Item>
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
