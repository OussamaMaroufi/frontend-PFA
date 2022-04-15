import { get, getApiUrl, post, put } from './config';

const getThreads = () => get({ url: getApiUrl(`api/threads/`) });
const markAsRead = (messageId) => put({ url: getApiUrl(`api/threads/${messageId}/read/`) });
const getUnreadMessagesCount = () => get({ url: getApiUrl(`api/threads/unread/count/`) });
const getMessages = (threadId)=>get({ url: getApiUrl(`api/threads/${threadId}/messages/`) })

//Test if there is a thread First if doesn't exist create a new one  
const createMessage = (message) =>
  post({
    url: getApiUrl(`api/messages/create/`),
    payload: message,
  });

const messageSerivce = {
  getThreads,
  createMessage,
  markAsRead,
  getUnreadMessagesCount,
  getMessages
};

export default messageSerivce;
