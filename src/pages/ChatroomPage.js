import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Page } from '../components';
import { MessageService } from '../services';
import store from '../store'

let userId ;
function ChatroomPage() {



  const userInfo = store.getState().auth
   userId = userInfo.user.id
  console.log(userId);
  //  Instanciate socket
  if(userId){
    let socket = new WebSocket(
  "ws://127.0.0.1:8000/" + `ws/users/${userId}/chat/`
);
}





  const [messages, setMessages] = useState([])
  const location = useLocation()
  const threadId = location.pathname.replace('/chatroom/', '');
  const [inputMessage, setInputMessage] = useState("")
  const [typing, setTyping] = useState(false);
  console.log("Your messages are ", messages);

  const messageSubmitHandler = (event) => {
    event.preventDefault()
    if (inputMessage) {
      console.log(inputMessage);
      //socket.send

    }
    setInputMessage("")
  }

  useEffect(() => {
    MessageService.getMessages(threadId).then(res => setMessages(res))
  }, [threadId])

  return (
    <Page>
      <div style={{ dispaly: 'flex' }}>
        <h2>Messages</h2>
        {
          messages.map((msg) => (
            <div key={msg.id}>
              <p>{msg.sender.username}:{msg.body}</p>
            </div>
          ))
        }

        <div>
          <form onSubmit={messageSubmitHandler}>
            <div>
              <input
                onChange={(event) => setInputMessage(event.target.value)}
                value={inputMessage}
                type="text"
                placeholder="Type your message"
                autoComplete="off"

              />
              <button>
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default ChatroomPage
