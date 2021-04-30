import React from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';

const Messages = () => {
  React.useEffect(() => animateScroll.scrollToBottom({
    duration: 0,
    delay: 0,
    containerId: 'message-container',
  }));
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const messages = useSelector((state) => state.messages);
  const currentChannelMessages = messages
    .filter(({ channelId }) => channelId === currentChannelId);
  return (
    <div className="d-flex flex-column h-100">
      <div id="message-container" className="overflow-auto mb-3">
        {currentChannelMessages.map(({ id, username, message }) => (
          <p key={id}>
            <b>
              {`${username}: `}
            </b>
            {message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Messages;
