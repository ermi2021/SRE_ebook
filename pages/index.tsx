import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, {useState, useEffect} from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { Document, Page } from 'react-pdf';
import dynamic from "next/dynamic";

const App = dynamic(()=> import('../components/App'));

const Home: NextPage = () => {

  return (
   <App/>
  )
}

export default Home
