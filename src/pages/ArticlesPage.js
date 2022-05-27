import React, { useEffect } from 'react';

import { Page } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { resetSearchArticles, searchArticles } from '../actions/articleActions';
import { Avatar, Button, AuthorBox } from '../common';
import { getApiUrl } from '../services/config';
import { Link } from 'react-router-dom';
import createDOMPurify from "dompurify"
import { getImageUrl } from '../utilities/getImageUrl';



const ArticlesPage = () => {
  const { data, loading } = useSelector((state) => state.articleSearchList);
  const dispatch = useDispatch();
  const DOMPurify = createDOMPurify(window);

  const { results: articles } = data;

  console.log("Articles ", articles);

  useEffect(() => {
    dispatch(searchArticles());
    return () => {
      dispatch(resetSearchArticles());
    };
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!data.next) return;
    const keywordWithPageNo = new URL(data.next).search;
    dispatch(searchArticles(keywordWithPageNo));
  };

  return (
    <Page>
      <section>
        {articles.map((article) => (

          <div key={article.id} className="card">
            <div className="card__body">

              <AuthorBox
                avatarSrc={getImageUrl(article.user.profile_pic)}
                name={article.user.name}
                handle={article.user.username}
                url={`/profile/${article.user.username}`}
                size="sm"
              />

              {/* <Link to={`/profile/${article.user.username}`}>
                <div className="article-item__profile">
                  <Avatar src={getImageUrl(article.user.profile_pic)} />
                  {article.user.username}
                </div>
              </Link>
        */}


              <div className="article-item">



                <Link to={`/article/${article.id}`}>
                  {/*<img alt="" className="avatar--md" src={article.user.profile_pic} />*/}
                  <div>
                    <strong>{article.title}</strong>
                  </div>
                  {/*<p>{article.content}</p>*/}
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}></p>
                </Link>

                {/* <Link to={`/profile/${article.user.username}`}>
                  <div className="article-item__profile">
                    <Avatar src={getApiUrl(article.user.profile_pic)} />
                    {article.user.username}
                  </div>
                </Link>
              */}



              </div>
            </div>
          </div>
        ))}

        <div>
          {data.next && (
            <Button
              size="lg"
              disabled={!data?.next || loading}
              onClick={handleLoadMore}
              text={!loading ? 'Load More' : 'Loading...'}
              iconName={loading && 'spinner fa-spin'}
            />
          )}
        </div>
      </section>

      <section></section>
    </Page>
  );
};

export default ArticlesPage;
