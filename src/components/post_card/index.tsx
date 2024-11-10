import { Post } from 'contentlayer/generated';
import Link from 'next/link';
import React, { useMemo } from 'react';
import AspectDiv from '../aspect_div';
import MyImage from '../my_image';
import Tag from '../tag';
import style from './index.module.scss';
interface Props {
  data: Post;
  mode?: 'small' | 'big';
}
function $PostCard(props: Props) {
  const { data, mode = 'small' } = props;

  const tags = useMemo(() => {
    if (data?.tags) {
      return data.tags.split('|');
    }
    return [];
  }, [data]);

  return (
    <Link href={`/post/${data.slug}`} style={{ minWidth: 0 }}>
      <div className={style['post-card']}>
        <AspectDiv width="100%" height="58%">
          <div className={style['cover']}>
            <MyImage src={data.cover}></MyImage>
          </div>
        </AspectDiv>
        <div className={style.tags}>
          {tags.slice(0, 2).map((tag, index) => {
            return <Tag text={tag} key={index}></Tag>;
          })}
        </div>
        {mode === 'big' ? (
          <h1 className={style['title-b']}>{data.title}</h1>
        ) : (
          <h2 className={style['title-s']}>{data.title}</h2>
        )}
        {mode === 'big' ? <div style={{ color: '#666' }}>{data.description}</div> : null}
      </div>
    </Link>
  );
}

const PostCard = React.memo($PostCard);

export default PostCard;
