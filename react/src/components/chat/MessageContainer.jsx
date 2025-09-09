const MessageContainer = ({ messages = [] }) => {
  return (
    <div className="message-container">
      {messages.map((message, index) => (
        <div key={index} className="message">
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
