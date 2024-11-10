import React from 'react';
import Divider from '../../components/divider';
import MapCard from '../../components/map_card';
import ViewHeader from '../../components/view_header';
import { maps } from '../../constants/maps';
import ContentSpace from '../../layouts/content_space';
import style from './index.module.scss';
function $Maps() {
  return (
    <div>
      <ContentSpace>
        <ViewHeader title="目录" desc="每一颗种子都会长成参天大树。"></ViewHeader>
        <Divider />
        <div className={style['list-container']}>
          {maps.map((item, index) => {
            return <MapCard key={index} data={item} />;
          })}
        </div>
      </ContentSpace>
    </div>
  );
}

const Maps = React.memo($Maps);

export default Maps;
