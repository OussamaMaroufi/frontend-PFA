import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Page } from '../components';
import { MessageService } from '../services';
import store from '../store'

import { getImageUrl } from '../utilities/getImageUrl';
import { AuthorBox } from '../common';

let userInfo = store.getState().auth
let userId = userInfo.user.id
let socket = new WebSocket(
  "ws://127.0.0.1:8000/" + `ws/users/${userId}/chat/`
);
function ChatroomPage() {



  // const userInfo = store.getState().auth
  //  userId = userInfo.user.id
  // console.log(userId);
  const location = useLocation()

  const threadId = location.pathname.replace('/chatroom/', '');

  socket.onmessage = (event) => {
    console.log(event)
    const data = JSON.parse(event.data)
    if (threadId == data.threadId) {
      if (data.action == "message") {
        //  setMessages((prev)=>[...prev,data.message])
        let message = {
          body: data.message,
          sender: data.username,
          timestamp: data.timestamp,
          msgId: data.msgId,
          imgUrl: data.imgUrl
        }

        setMessages((prev) => [...prev, message])
      }
    }

  }



  let userInfo = store.getState().auth
  let userId = userInfo.user.id


  const [messages, setMessages] = useState([])
  
  const RecipientInfo = location.state;
  console.log(RecipientInfo);
  
  const [inputMessage, setInputMessage] = useState("")
  const [typing, setTyping] = useState(false);
  console.log("Your messages are ", messages);

  const messageSubmitHandler = (event) => {
    event.preventDefault()
    if (inputMessage) {
      socket.send(
        JSON.stringify({
          action: 'message',
          message: inputMessage,
          user: userId,
          threadId: threadId
        })
      )

    }
    setInputMessage("")
  }

  useEffect(() => {
    MessageService.getMessages(threadId).then(res => {
      let msgs = [];
      msgs = res.map((msg) => (
        { body: msg.body, sender: msg.sender.name, timesatmp: msg.timestamp, msgId: msg.id, imgUrl: msg.sender.profile_pic }
      ))
      console.log("msgs", msgs);
      setMessages(msgs)
    })
  }, [threadId])

  return (
    <Page>
      <div style={{ dispaly: 'flex' }}>
          <AuthorBox
          avatarSrc={getImageUrl(RecipientInfo.profile_pic)}
          url={`/profile/${RecipientInfo.username}`}
          name={RecipientInfo.name}
          handle={RecipientInfo.username}
          size="md"
        />
        <h2>Messages</h2>
        {
          messages.map((msg) => (
            <div key={msg.msgId}>
              <p>{msg.sender}:{msg.body}</p>
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
