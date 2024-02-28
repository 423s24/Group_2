// Importing necessary dependencies and components
import { useState } from 'react';
import { sendMessage, isTyping } from 'react-chat-engine';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';

// MessageForm component definition
const MessageForm = (props) => {
    // State to manage the input value for the message
    const [value, setValue] = useState('');
    
    // Destructuring props to extract necessary data
    const { chatId, creds } = props;

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Trimming the message text
        const text = value.trim();

        // Sending the message only if it has content
        if (text.length > 0) sendMessage(creds, chatId, { text });

        // Clearing the input value after sending the message
        setValue('');
    }

    // Function to handle input value change
    const handleChange = (event) => {
        // Updating the input value
        setValue(event.target.value);

        // Indicating that the user is typing
        isTyping(props, chatId);
    }

    // Function to handle file upload
    const handleUpload = (event) => {
        // Sending the uploaded file as a message
        sendMessage(creds, chatId, { files: event.target.files, text: '' });
    }

    // Rendering the MessageForm component
    return (
        <form className="message-form" onSubmit={handleSubmit}>
            {/* Input for typing messages */}
            <input
                className="message-input"
                placeholder="Send a message..."
                value={value}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            {/* Label and input for file upload */}
            <label htmlFor="upload-button">
                <span className='image-button'>
                    <PictureOutlined className="picture-icon" />
                </span>
            </label>
            <input
                type="file"
                multiple={false}
                id="upload-button"
                style={{ display: 'none' }}
                onChange={handleUpload}
            />

            {/* Button to submit the message */}
            <button type='submit' className='send-button'>
                <SendOutlined className='send-icon' />
            </button>
        </form>
    );
}

// Exporting MessageForm component as the default export
export default MessageForm;
