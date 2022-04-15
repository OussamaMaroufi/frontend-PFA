import React, { useEffect } from 'react';
import { useState } from 'react';
import { MessageService } from '../services';
import { Page } from '../components';
import { AuthorBox, Button } from '../common';
import mailbox from '../assets/images/mailbox.svg';
import { getImageUrl } from '../utilities/getImageUrl';
import '../styles/components/InboxPage.css';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

const InboxPage = () => {
  const [threads, setThreads] = useState([]);
  const [count, setCount] = useState(0);

  const username = useSelector((state) => state.auth.user.username);


  useEffect(() => {
    MessageService.getUnreadMessagesCount().then(({ count }) => setCount(count));
  }, []);

  // const markAsRead = async (message) => {
  //   // await MessageService.markAsRead(message.id);
  //   // await MessageService.getUnreadMessagesCount().tuhen(({ count }) => setCount(count));
  //   await MessageService.getMessages().then(setMessages);
  // };

  useEffect(() => {
    MessageService.getThreads().then(res => setThreads(res));

  }, []);

  return (
    <Page>
      <section>
        <h1>New Threads ({threads.length})</h1>
        {threads.length === 0 && (
          <div className="empty-mailbox">
            <img alt="empty-mailbox" className="empty-mailbox__image" src={mailbox} />
            <h3>You have no contact users</h3>
          </div>
        )}
        {threads.map((thread) => (
          <div key={thread.id} className="card">

            <div className="card__body">
              <div className="searchItem">
                <div className="searchItem__top">


                  {
                    thread.reciever.username == username ? (
                      <AuthorBox
                        avatarSrc={getImageUrl(thread.sender.profile_pic)}
                        url={`/profile/${thread.sender.username}`}
                        name={thread.sender.name}
                        handle={thread.sender.username}
                        size="md"
                      />
                    ) :
                      <AuthorBox
                        avatarSrc={getImageUrl(thread.reciever.profile_pic)}
                        url={`/profile/${thread.reciever.username}`}
                        name={thread.reciever.name}
                        handle={thread.reciever.username}
                        size="md"
                      />

                  }



                </div>
                <p className="searchItem__bottom">{thread.last_message.body}</p>
                <Link
                  to ={`/chatroom/${thread.id}`}
                >
                <Button text="Join" />
                </Link>
              </div>
            </div>

          </div>
        ))}
      </section>

      <section></section>
    </Page>
  );
};

export default InboxPage;
