import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
  const messages = useSelector((state) => state.messages);
  return (
    <div>
      {messages.map(({ id, text }) => <p key={id}>{text}</p>)}
    </div>
  );
};

export default Messages;
