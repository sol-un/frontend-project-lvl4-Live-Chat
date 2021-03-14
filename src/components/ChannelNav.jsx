import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { changeCurrentChannelId } from '../slices/currentChannelIdSlice.js';
import NewChannelModal from './NewChannelModal.jsx';

const ChannelNav = () => {
  const [currentModal, setCurrentModal] = React.useState(null);
  const channels = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.currentChannelId);

  const dispatch = useDispatch();

  const handleCurrentChannelChange = (id) => () => dispatch(changeCurrentChannelId(id));
  const handleNewChannelModal = () => setCurrentModal('new');
  const closeCurrentModal = () => setCurrentModal(null);

  return (
    <>
      <NewChannelModal show={currentModal === 'new'} onHide={closeCurrentModal} />
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button type="button" className="btn btn-link ml-auto p-0" onClick={handleNewChannelModal}>+</button>
      </div>
      <Nav variant="pills" className="flex-column nav-fill" as="ul">
        {channels.map(({ id, name, removable }) => (
          <Nav.Item
            key={id}
            onClick={handleCurrentChannelChange(id)}
            as="li"
          >
            <Nav.Link
              as="button"
              type="button"
              className={`btn ${id === currentChannelId && 'btn-primary'} btn-block mb-2 text-left`}
              active={id === currentChannelId}
            >
              {name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </>
  );
};

export default ChannelNav;
