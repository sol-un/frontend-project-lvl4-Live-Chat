import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
  const messages = useSelector((state) => state.messages);
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);
  return (
    <div className="overflow-auto mb-3">
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
