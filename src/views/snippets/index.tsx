import { allSnippets } from 'contentlayer/generated';
import React from 'react';

import Divider from '../../components/divider';
import SnippetCard from '../../components/snippet_card';
import ViewHeader from '../../components/view_header';
import ContentSpace from '../../layouts/content_space';
import style from './index.module.scss';
function $Snippets() {
  return (
    <div>
      <ContentSpace>
        <ViewHeader title="只言片语" desc="灵光一闪渐渐汇聚成思想之海。"></ViewHeader>
        <Divider />
        <div className={style['list-container']}>
          {allSnippets.map((item, index) => {
            return (
              <SnippetCard
                key={index}
                title={item.title}
                desc={item.description}
                cover={item.cover}
                slug={item.slug}
              />
            );
          })}
        </div>
      </ContentSpace>
    </div>
  );
}

const Snippets = React.memo($Snippets);

export default Snippets;
