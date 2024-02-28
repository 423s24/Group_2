// Importing necessary components
import MessageForm from "./MessageForm";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";

// ChatFeed component definition
const ChatFeed = (props) => {
    // Destructuring props to extract necessary data
    const { chats, activeChat, userName, messages } = props;

    // Accessing the active chat from the chats object
    const chat = chats && chats[activeChat];

    // Function to render read receipts for messages
    const renderReadReceipts = (message, isMyMessage) => {
        // Mapping through people in the chat and rendering read receipts for the current message
        chat.people.map((person, index) => person.last_read === message.id && (
            <div
                key={`read_${index}`}
                className="read-receipt"
                style={{
                    float: isMyMessage ? 'right' : 'left',
                    backgroundImage: `url(${person?.person?.avatar})`
                }}
            />
        ))
    }

    // Function to render individual messages
    const renderMessages = () => {
        // Extracting keys from the messages object
        const keys = Object.keys(messages);

        // Mapping through keys to render each message
        return keys.map((key, index) => {
            const message = messages[key];
            const lastMessageKey = index === 0 ? null : keys[index - 1];
            const isMyMessage = userName === message.sender.username;

            return (
                <div key={`msg_${index}`} style={{ width: '100%' }}>
                    <div className="message-block">
                        {
                            // Rendering MyMessage component if the message is sent by the user, else rendering TheirMessage
                            isMyMessage
                                ? <MyMessage message={message} />
                                : <TheirMessage message={message} lastMessage={messages[lastMessageKey]} />
                        }
                    </div>
                    <div className="read-receipt" style={{ marginRight: isMyMessage ? '18px' : '0px', marginLeft: isMyMessage ? '0px' : '68px' }}>
                        {renderReadReceipts(message, isMyMessage)}
                    </div>
                </div>
            );
        })
    }

    // If chat is not available, display 'Loading ...'
    if (!chat) return 'Loading ...';

    // Rendering the ChatFeed component
    return (
        <div className="chat-feed">
            <div className="chat-title-container">
                {/* Displaying chat title */}
                <div className="chat-title">{chat?.title}</div>
                {/* Displaying usernames of people in the chat */}
                <div className="chat-subtitle">
                    {chat.people.map((person) => ` ${person.person.username}`)}
                </div>
            </div>
            {/* Rendering individual messages */}
            {renderMessages()}
            {/* Adding empty space */}
            <div style={{ height: '100px' }} />
            {/* Rendering MessageForm component with necessary props */}
            <div className="message-form-container">
                <MessageForm {...props} chatId={activeChat} />
            </div>
        </div>
    )
}

// Exporting ChatFeed component as the default export
export default ChatFeed;