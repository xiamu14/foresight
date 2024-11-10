import { allPosts } from 'contentlayer/generated';
import React, { useMemo } from 'react';
import Divider from '../../components/divider';
import PostCard from '../../components/post_card';
import PostCollection from '../../components/post_collection';
import PostPopular from '../../components/post_popular';
import ViewHeader from '../../components/view_header';
import ContentSpace from '../../layouts/content_space';
import style from './index.module.scss';
function $Home() {
  const posts = useMemo(
    () =>
      allPosts
        .filter((it) => it.status !== 'draft')
        .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))),
    []
  );

  const recommendPost = useMemo(() => {
    const list = posts.filter((it) => it.status === 'recommend');
    return list[0];
  }, [posts]);

  const subjectPost = useMemo(() => {
    const list = posts.filter((it) => it.status === 'subject');
    return list;
  }, [posts]);

  return (
    <div>
      <ContentSpace>
        <ViewHeader title="言物" desc={<p>《周易·家人》：“君子以言有物，而行有恒”。</p>} />
        <Divider />
        <div className={style['commend-container']}>
          <div className={style['post-detail']}>
            <div className={style['post-item-small']}>
              {subjectPost.map((item, index) => {
                return <PostCard key={index} data={item} />;
              })}
            </div>
            <div className={style['post-item-big']}>
              <PostCard mode="big" data={recommendPost} />
            </div>
          </div>
          <div className={style['post-outline']}>
            <PostCollection />
            <PostPopular />
          </div>
        </div>
        <Divider />
        <div className={style['list-container']}>
          {posts.map((item, index) => {
            return <PostCard key={index} data={item} />;
          })}
        </div>
      </ContentSpace>
    </div>
  );
}

const Home = React.memo($Home);

export default Home;
