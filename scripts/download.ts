// 安装依赖
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

// 下载图片并保存
async function downloadImage(id: number) {
  try {
    // 搜索图片
    const endpoint =
      'https://api.unsplash.com/photos/random/?client_id=G9TqWHSpfznQX8Dcb25WU5UOUSuFJcN942Fha3YJfEc';
    const response = await fetch(endpoint);
    const data = await response.json();

    // 使用 node-fetch 下载图片数据
    const pictureRes = await fetch(data.urls.regular);
    // const buffer = await pictureRes.buffer();

    // // 保存图片到本地
    // fs.writeFileSync(path.join(cwd(), `../public/images/random/${id}.png`), buffer);
    console.log(`图片已保存到 ${id}.png`);
  } catch (error) {
    console.error('下载图片时出错:', error);
  }
}

const imagesPromiseList = new Array(30).fill(0).map(async (_, index) => {
  await downloadImage(index + 1);
});

async function run() {
  await Promise.allSettled(imagesPromiseList);
}

run();
