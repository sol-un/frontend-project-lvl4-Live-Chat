import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav, NavLink, Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { changeCurrentChannelId } from '../slices/currentChannelId.js';
import CreateChannelModal from './modals/CreateChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';
import DeleteChannelModal from './modals/DeleteChannelModal.jsx';

const ChannelNav = () => {
  const [currentModalData, setCurrentModalData] = React.useState({
    showing: null,
    id: null,
    channelName: null,
  });
  const channels = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();

  const handleCurrentChannelChange = (id) => () => dispatch(changeCurrentChannelId(id));

  const handleNewChannelModal = () => setCurrentModalData((prevState) => ({
    ...prevState,
    showing: 'new',
  }));
  const handleRenameChannelModal = (id, channelName) => () => setCurrentModalData({ showing: 'rename', id, channelName });
  const handleDeleteChannelModal = (id, channelName) => () => setCurrentModalData({ showing: 'delete', id, channelName });
  const closeCurrentModal = () => setCurrentModalData((prevState) => ({
    ...prevState,
    showing: null,
  }));

  return (
    <>
      <CreateChannelModal
        show={currentModalData.showing === 'new'}
        closeCurrentModal={closeCurrentModal}
      />
      <RenameChannelModal
        show={currentModalData.showing === 'rename'}
        id={currentModalData.id}
        channelName={currentModalData.channelName}
        closeCurrentModal={closeCurrentModal}
      />
      <DeleteChannelModal
        show={currentModalData.showing === 'delete'}
        id={currentModalData.id}
        channelName={currentModalData.channelName}
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
