import React, { useState } from 'react';
import { Modal, ModalContentAction, TextArea } from '../common';
import { MessageService } from '../services';
import store from '../store';
import axios from 'axios';


const CreateMessageModal = ({ active, setActive, toUser, onMessageCreated }) => {
  const [content, setContent] = useState('');

  // const userInfo = store.getState().auth


  const createMessage = async () => {
    
    const recipient_id = toUser['id']
    console.log("touser", recipient_id);
    const data = {
      recipient_id:recipient_id
    }
    
    const thread = await MessageService.createOrgetThread(data)
    console.log("THread", thread);

    const payload =  {
      thread_id:thread.id,
      message:content
    }

    // return thread between target user if doesn'texist create a new one 
    await MessageService.createMessage(payload);
    setContent('');
    setActive(false);
    onMessageCreated();
  };

  return (
    <Modal heading="Create Message" active={active} setActive={setActive}>
      <form>
        <TextArea
          label="Type your Message"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></TextArea>
      </form>
      <ModalContentAction confirmLabel="Send" setActive={setActive} successAction={createMessage} />
    </Modal>
  );
};
export default CreateMessageModal;
