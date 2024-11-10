import { GeistProvider } from '@geist-ui/core';
import Head from 'next/head';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import ContentWidth from '../layouts/content_width';
import Router from '../router';
import style from '../styles/index.module.scss';
export default function Index() {
  return (
    <GeistProvider>
      <div className={style.index}>
        <Head>
          <title>言物</title>
        </Head>
        <div className={style.header}>
          <Navbar />
        </div>
        <div className={style.content}>
          <ContentWidth>
            <Router></Router>
          </ContentWidth>
        </div>
        <Footer />
      </div>
    </GeistProvider>
  );
}
