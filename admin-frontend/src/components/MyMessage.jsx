// MyMessage component definition
const MyMessage = ({ message }) => {
    // Checking if the message has attachments
    if (message?.attachments?.length > 0) {
        // Rendering an image if there are attachments
        return (
            <img
                src={message.attachments[0].file}
                alt="message-attachment"
                className="message-image"
                style={{ float: 'right' }}
            />
        );
    }

    // Rendering a text message if there are no attachments
    return (
        <div className="message" style={{ float: 'right', marginRight: '18px', color: 'white', backgroundColor: '#137E86' }}>
            {message.text}
        </div>
    );
}

// Exporting MyMessage component as the default export
export default MyMessage;
