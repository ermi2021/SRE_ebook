import type { NextPage } from 'next'
import useSWR from 'swr';


import React from 'react';
import dynamic from "next/dynamic";

const App = dynamic(() => import('../components/App'));

const Home: NextPage = () => {
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  // const { data } = useSWR('/api/readfiles', fetcher);
  return (
    // {!data && "Loading..."}
    <App />
  )
}

export default Home
