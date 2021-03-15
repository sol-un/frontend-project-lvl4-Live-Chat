import React from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';

const Messages = () => {
  React.useEffect(() => animateScroll.scrollToBottom({
    duration: 0,
    delay: 0,
    containerId: 'message-container',
  }));
  const messages = useSelector((state) => state.messages);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);
  return (
    <div id="message-container" className="overflow-auto mb-3">
      {currentChannelMessages.map(({ id, text, userName }) => (
        <p key={id}>
          <b>
            {`${userName}: `}
          </b>
          {text}
        </p>
      ))}
    </div>
  );
};

export default Messages;
