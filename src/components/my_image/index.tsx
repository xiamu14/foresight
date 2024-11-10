import NextImage from 'next/image';
import { useEffect, useState, memo } from 'react';

function $MyImage(props: { src: string; alt?: string }) {
  const { src, alt } = props;
  const random = Math.round(Math.random() * 5);
  const [picture, setPicture] = useState(`/images/random/0${random}.avif`);
  useEffect(() => {}, []);

  return <NextImage src={picture} alt={alt ?? ''} fill />;
}

const MyImage = memo($MyImage);

export default MyImage;
