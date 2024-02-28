// TheirMessage component definition
const TheirMessage = ({ lastMessage, message }) => {
    // Checking if the current message is the first message by the user
    const isFirstMessageByUser = !lastMessage || lastMessage.sender.username !== message.sender.username;

    // Rendering the TheirMessage component
    return (
        <div className="message-row">
            {isFirstMessageByUser && (
                // Displaying the user's avatar if it's the first message by the user
                <div
                    className="message-avatar"
                    style={{ backgroundImage: `url(${message?.sender?.avatar})` }}
                />
            )}

            {message?.attachments?.length > 0
                ? (
                    // Rendering an image if there are attachments
                    <img
                        src={message.attachments[0].file}
                        alt="message-attachment"
                        className="message-image"
                        style={{ marginLeft: isFirstMessageByUser ? '4px' : '48px' }}
                    />
                ) : (
                    // Rendering a text message if there are no attachments
                    <div className="message" style={{ float: 'left', backgroundColor: '#79e4ec' }}>
                        {message.text}
                    </div>
                )
            }
        </div>
    );
}

// Exporting TheirMessage component as the default export
export default TheirMessage; 
