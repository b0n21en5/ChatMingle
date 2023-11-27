# Chat Mingle - WhatsApp Clone
Chat Mingle is a MERN stack web application that serves as a WhatsApp clone, allowing users to register, log in, and communicate in real-time. It features a dynamic authentication page, a contact list with real-time updates, a messaging container, and various other functionalities.

## <a target="_blank" href="https://chat-mingle-web.netlify.app">Deployed Site</a> 🌐
- Demo username: aman 
- Demo password: 1234

![](https://github.com/b0n21en5/ChatMingle/blob/main/frontend/src/assets/chat-mingle.png)

## Table of Contents
- Features
- Pages
- Technologies Used
- Server Setup
- Client Setup
  
  
## Features🚀

### Real-time Communication:
- Implemented real-time data communication using socket.io-client.
- User online/offline status updates.
  
  
### Authentication:
- Dynamic authentication page with user registration, login, and password reset facilities.

### Contact List:
- Displays a list of contacts/users.
- Shows the most recent message under each contact name.
- Refreshes contact list on new messages.

### Profile Management:
- Users can update their credentials through a profile modal.
- Profile image upload during registration or later from the profile modal.
  
### Messaging:
- Individual user conversations in a message container.
- Message timestamps using the moment package.
- Emoji Picker for selecting and sending emojis.

### Search Functionality:
- Users can search for other users in the contact list.

### Notifications:
- Utilizes react-hot-toast to notify users about important notifications.

### State Management:
- React-Redux and Redux Toolkit for efficient state management.

### Icons:
- Uses react-icons for a consistent set of icons across the application.
  
## Pages📄

### Authentication Page:
- Dynamic page with user registration, login, and password reset functionalities.

### Home Page:
- Contact list, showing online/offline status.
- Message container for individual conversations.
  
### Modals:
- User Menu Modal.
- Profile Modal.
  
## Technologies Used💻

### Frontend:
- React for the user interface.
- Redux and Redux Toolkit for state management.
- Socket.io-client for real-time communication.
- react-icons for iconography.
- react-hot-toast for notifications.

### Backend:
- Express.js for the server.
- Socket.io for real-time message transfer/communication.
- Bcrypt.js for password hashing.
- CORS for production and deployment environment setup.


## Server Setup⚙️
1.  Clone the repository
```bash
git clone https://github.com/b0n21en5/ChatMingle.git
```
2. Navigate to the server directory
```bash
cd server
```
3. Install server dependencies
```bash
npm install
```
4. Configure environment variables
5. Run the server.
```bash
npm run server
```


## Client Setup⚙️
1. Navigate to the client directory
  ```bash
cd client
```
2. Install frontend dependencies
```bash
npm install
```
3. Run the client
```bash
npm run dev
```
4. Access the application at http://localhost:5173

#### 🚀Happy coding!✨
