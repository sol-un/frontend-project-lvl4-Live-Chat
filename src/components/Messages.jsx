import React from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';

const Messages = () => {
  const currentChannelId = useSelector((state) => state.channelsInfo.currentChannelId);
  const currentChannelMessages = useSelector((state) => state.messagesInfo.messages
    .filter(({ channelId }) => channelId === currentChannelId));

  React.useEffect(() => animateScroll.scrollToBottom({
    duration: 0,
    delay: 0,
    containerId: 'message-container',
  }), [currentChannelId, currentChannelMessages]);

  return (
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
  );
};

export default Messages;
