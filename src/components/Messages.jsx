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
  const currentChannelMessages = React.useMemo(
    () => messages.filter(({ channelId }) => channelId === currentChannelId),
    [currentChannelId, messages],
  );
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
