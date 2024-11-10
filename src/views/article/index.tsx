import { Drawer } from '@geist-ui/core';
import { allPosts, allSnippets, Post, Snippet } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import AspectDiv from '../../components/aspect_div';
import Divider from '../../components/divider';
import mdxComponent from '../../components/mdx_component';
import MindMap from '../../components/mind_map';
import MyImage from '../../components/my_image';
import ContentSpace from '../../layouts/content_space';
import emptyCode from '../../utils/empty_code';
import style from './index.module.scss';
export default function Article() {
  const location = useLocation();
  const [data, setData] = useState<Snippet | Post>();
  const [mindDrawerVisible, setMindDrawerVisible] = useState(false);
  useEffect(() => {
    const dataset = location.pathname?.includes('post') ? allPosts : allSnippets;
    const article = (dataset as any).find((item: any) => location.pathname?.includes(item.slug));
    setData(article);
  }, [location.pathname]);

  const Component = useMDXComponent(data ? data.body.code : emptyCode);

  const handleCloseMindDrawer = useCallback(() => {
    setMindDrawerVisible((prev) => !prev);
  }, []);

  if (!data) return null;

  return (
    <ContentSpace>
      <div className={style['box']}>
        <header className={style.header}>
          <div className={style.cover}>
            <AspectDiv width="100%" height="48%">
              <MyImage src={data.cover}></MyImage>
            </AspectDiv>
          </div>
        </header>
        <div className={style['container']}>
          <div className={style.content}>
            <h1 className={style['title']} onClick={handleCloseMindDrawer}>
              {data.title}
            </h1>
            <div className={style['desc-box']}>
              {/* <p className={style['description']}>{data.description}</p> */}
              <div className={style.info}>
                <p>
                  {format(parseISO(data.date), 'MMMM dd, yyyy')} / {data.readingTime.text}
                </p>
              </div>
            </div>

            <Divider />
            <div className="article">
              <Component components={mdxComponent as any} />
            </div>
          </div>
          {/* <div className={style.aside}>
            <div className={style.placeholder}></div>
            <PostPopular />
          </div> */}
        </div>
      </div>
      <Drawer
        visible={mindDrawerVisible}
        onClose={handleCloseMindDrawer}
        placement="right"
        style={{ width: 600, borderRadius: '10px' }}
      >
        <Drawer.Title>思维导图</Drawer.Title>
        <Drawer.Content>
          <MindMap post={data as Post}></MindMap>
        </Drawer.Content>
      </Drawer>
    </ContentSpace>
  );
}
