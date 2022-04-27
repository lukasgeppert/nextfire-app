import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@styles/Home.module.css'

import Loader from '@components/Loader'
import toast from 'react-hot-toast'
import { firestore, fromMillis, postToJSON } from '@lib/firebase';

import { useState } from 'react';
import PostFeed from '@components/PostFeed'

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [isLoading, setIsLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setIsLoading(true);

    const lastPost = posts[posts.length - 1];

    const cursor = typeof lastPost.createdAt === 'number' ? fromMillis(lastPost.createdAt) : lastPost.createdAt;

    const postsQuery = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await postsQuery.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setIsLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }



  return (
    <main>
      <PostFeed posts={posts} admin='true' />

      {posts.length < 1 && <p>There are no posts</p>}

      {posts.length > 0 && ! isLoading && ! postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader  show={isLoading} />

      {postsEnd && <p>No more posts to load</p>}
    </main>
  );
}
