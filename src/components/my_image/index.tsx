import NextImage from 'next/image';
import { useEffect, useState, memo } from 'react';

function $MyImage(props: { src: string; alt?: string }) {
  const { src, alt } = props;

  const [picture, setPicture] = useState('');
  useEffect(() => {
    const endpoint =
      'https://api.unsplash.com/photos/random/?client_id=G9TqWHSpfznQX8Dcb25WU5UOUSuFJcN942Fha3YJfEc';
    fetch(endpoint).then(async (response) => {
      const data = await response.json();
      setPicture(data.urls.regular);
    });
  }, []);

  return <NextImage src={picture} alt={alt ?? ''} fill />;
}

const MyImage = memo($MyImage);

export default MyImage;
