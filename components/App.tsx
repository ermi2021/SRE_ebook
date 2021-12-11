import React, { ChangeEventHandler, useState, useEffect } from "react";

import * as Helpers from "./helpers";
import styles from "../styles/App.module.css";
import Head from 'next/head';
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import jsPDF from "jspdf";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import ImageList from '@mui/material/ImageList';
import ListSubheader from '@mui/material/ListSubheader';
import ImageListItem from '@mui/material/ImageListItem';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ReactTypingEffect from 'react-typing-effect';
import SaveIcon from '@mui/icons-material/Save';
import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import useSWR from "swr";
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Badge from '@mui/material/Badge';

import Font, { Text } from 'react-font'


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "black",
    borderColor: "white"
  },
  textFieldInput: {
    color: "black",
    borderColor: "white",
    fontWeight: "bold"
  },
  borderField: {
    borderColor: "white"
  }
}));


function App() {
  const [uploadedImages, setUploadedImages] = React.useState([]);
  const [pdfBlob, setPdf] = useState(new jsPDF());
  const [pdfUrl, setPdfUrl] = useState(new URL("https://fetzer.org/sites/default/files/images/stories/pdf/selfmeasures/Different_Types_of_Love_PASSIONATE.pdf"));
  const [layout, setLayout] = React.useState('p');
  const [pageSize, setPageSize] = React.useState('a4');
  const [width, setWidth] = React.useState(210);
  const [height, setHeight] = React.useState(297);
  const [addFirstPage, setAddFirstPage] = React.useState(false);
  const [pageTitle, setPageTitle] = React.useState('Title');
  const [fontSize, setFontSize] = React.useState(40);
  const [titlePosition, setTitlePosition] = React.useState({ left: 40, top: 140 });
  const [preview, setPreview] = React.useState(false);
  const [nightMode, setNightMode] = React.useState(false);
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const [pdfImage, setPdfImage] = useState([]);
  let { data } = useSWR('/api/readfiles', fetcher);
  const [orderdImg, setOrderdImage] = useState([]);


  const classes = useStyles();

  const handleNightMode = () => {
    setNightMode(!nightMode);
  }

  const handlePreviewChange = () => {
    setPreview(!preview);
  }

  const handleLayoutChange = (event: any) => {
    setLayout(event.target.value);
  };

  const handleSizeChange = (event: any) => {
    setPageSize(event.target.value);
  };

  const handleImgWidth = (event: any) => {
    setWidth(event.target.value);
  };

  const handleImgHeight = (event: any) => {
    setHeight(event.target.value);
  };

  const handleFirstPage = (event: any) => {
    setAddFirstPage(!addFirstPage);
    setPageTitle('Title');
    setFontSize(40);
    setTitlePosition({ left: 40, top: 140 });
  };

  const handlePageTitle = (event: any) => {
    setPageTitle(event.target.value)
  };

  const handleFontSize = (event: any) => {
    setFontSize(event.target.value)
  };

  const handleTitlePosition = (event: any) => {
    if (event.target.value == "tc") {
      setTitlePosition({ left: 40, top: 30 });
    }
    if (event.target.value == "tl") {
      setTitlePosition({ left: 4, top: 30 });
    }
    if (event.target.value == "mr") {
      setTitlePosition({ left: 70, top: 30 });
    }
    if (event.target.value == "mc") {
      setTitlePosition({ left: 40, top: 140 });
    }
    if (event.target.value == "ml") {
      setTitlePosition({ left: 10, top: 140 });
    }
    if (event.target.value == "mr") {
      setTitlePosition({ left: 70, top: 140 });
    }
    if (event.target.value == "bc") {
      setTitlePosition({ left: 40, top: 230 });
    }
    if (event.target.value == "bl") {
      setTitlePosition({ left: 10, top: 230 });
    }
    if (event.target.value == "br") {
      setTitlePosition({ left: 70, top: 230 });
    }

  };

  const handleChangeStatus = ({ meta }: any, status: any) => {
    console.log(status, meta)
  }

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#f6f6f6" : "transparent",
    padding: 8,
    width: 250,
    marginLeft: 110,
    paddingLeft: 20,
    paddingRight: 20,

  });

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      data,
      result.source.index,
      result.destination.index
    );
    data = items;
    setUploadedImages(data);
    // return data;
  }

  const removeItem = (index) => {
    const removed = data.splice(index, 1);
    setUploadedImages(removed);
  }

  useEffect(() => {
    setPdf(Helpers.generatePdfFromImages(uploadedImages, width, height, layout, pageSize, addFirstPage, pageTitle, fontSize, titlePosition));
  }, [uploadedImages, layout, pageSize, width, height, addFirstPage, pageTitle, fontSize, titlePosition, data])

  useEffect(() => {
    setPdfUrl(pdfBlob.output("bloburl"));
  }, [pdfBlob])

  useEffect(() => {
    if (data) {
      // console.log("from the ueEffect ", data);
      setUploadedImages(data);

    } else {
      console.log("from the ueEffect ", data);
    }
  }, [data]);


  const cleanUpUploadedImages = React.useCallback(() => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }, [setUploadedImages, uploadedImages]);

  const savePdf = React.useCallback(() => {
    pdfBlob.save('test.pdf');
  }, [uploadedImages, cleanUpUploadedImages]);

  return (
    <>
      <div className={nightMode == true ? styles.containerNight : styles.containerLight}>
        <Head>
          <title>Ebook maker</title>
          <meta name="description" content="Ebook creater by SRE" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Box>
            {nightMode == true ? (
              <AppBar position="fixed" className={styles.navbarBoxNight}>
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  ></IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <img
                      src="https://sreglobal.com/images/logo.png"
                    />
                  </Typography>

                </Toolbar>
              </AppBar>
            ) : (
              <AppBar position="fixed" className={styles.navbarBoxLight}>
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  ></IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <img
                      src="https://sreglobal.com/images/logo.png"

                    />
                  </Typography>

                </Toolbar>
              </AppBar>
            )}


            <Grid container spacing={2} className={styles.mainGrid}>
              <Grid item xs={3.5} className={styles.uploadContainer}>
                <Stack direction="row" alignItems="left" sx={{
                  marginY: 4
                }} spacing={2}>


                </Stack>
                {uploadedImages.length > 0 ? (
                  <Box sx={{ width: 500, height: 650, display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center" }} >
                    {/* <h1>Images read from API route: </h1> */}
                    <Typography variant="div" sx={{
                      backgroundColor: "#f6f6f6",
                      padding: "15px",

                      boxShadow: 5,

                      fontWeight: "bold"
                    }}><Badge badgeContent={uploadedImages.length} color="secondary" sx={{
                      marginLeft: 2,
                      marginRight: 1,
                      fontSize: 22,
                      fontWeight: "bold"
                    }}></Badge>  Images Uploaded</Typography>
                    <Box sx={{ width: "100%", height: "100%", overflowY: 'scroll', paddingY: "20px", marginY: "20px" }} >
                      <DragDropContext onDragEnd={onDragEnd}>
                        <ImageList>
                          <Droppable droppableId="droppable-1">
                            {(provided: any, snapshot: any) => (
                              <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
                                {uploadedImages.map((image: any, ind: any) => (
                                  <Draggable key={ind} draggableId={'draggable-' + ind} index={ind} >
                                    {(provided: any, snapshot: any) => (
                                      <ImageListItem key={ind} className="styles.imageListContainer"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                          marginBottom: 3
                                        }}
                                      >
                                        <Image
                                          {...provided.dragHandleProps}
                                          {...provided.draggableProps}
                                          src={'data:image/jpeg;base64,' + image}
                                          alt="uploaded Image"
                                          loading="lazy"
                                          width="50"
                                          height="200"
                                        />
                                        <ImageListItemBar
                                          title={<Badge badgeContent={ind + 1} color="primary" sx={{
                                            marginLeft: 2,
                                            fontSize: 20
                                          }}></Badge>}
                                          position="top"
                                          // subtitle={item.author}  
                                          sx={{
                                            backgroundColor: "transparent"
                                          }}
                                        />

                                      </ImageListItem>
                                    )}

                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}

                          </Droppable>
                        </ImageList>
                      </DragDropContext>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ width: 500, height: 650, display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center" }}>

                    {nightMode == true ? (
                      <>
                        <AddPhotoAlternateIcon sx={{
                          color: "#f6f6f6",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center",
                          fontSize: 70,
                          marginBottom: 3

                        }} />
                        <Typography variant="h6" sx={{
                          color: 'white',
                          fontWeight: "bold",
                          textAlign: "center"
                        }} component="div" gutterBottom>
                          No Images Uploaded / Add your images
                        </Typography>
                      </>
                    ) : (
                      <>
                        <AddPhotoAlternateIcon sx={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center",
                          fontSize: 70,
                          marginBottom: 3
                        }} />
                        <Typography variant="h6" sx={{
                          color: 'black',
                          fontWeight: "bold",
                          textAlign: "center"
                        }} component="div" gutterBottom>
                          No Images Uploaded / Add your images
                        </Typography>
                      </>
                    )}

                  </Box>
                )}
                {uploadedImages.length > 0 ? (
                  <Button fullWidth color="info" variant="contained" onClick={handlePreviewChange} sx={{
                    marginTop: 5,
                    width: 500
                  }} component="div" startIcon={<VisibilityIcon />}>
                    Preview Pdf
                  </Button>
                ) : (
                  <>

                  </>
                )}
              </Grid>

              <Grid item xs={preview == true ? 6 : 8.5} className={styles.editContainer}>
                {preview == true ? (
                  <iframe name="someFrame" src={pdfUrl.toString()} id="someFrame" className={styles.ifream}></iframe>
                ) : (
                  <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignContent: "left", justifyContent: "center" }}>
                    {nightMode == true ? (
                      <>
                        <Typography variant="h4" sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          WELCOME TO SRE E-BOOK MAKER
                        </Typography>

                        <Typography variant="h2" sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          <ReactTypingEffect
                            text={["Upload Images", "Convert to PDF", "Save in PDF format"]}
                          />
                        </Typography>
                      </>
                    ) : (

                      <>
                        <Typography variant="h3" sx={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          WELCOME TO SRE E-BOOK MAKER
                        </Typography>

                        <Typography variant="h2" sx={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          <ReactTypingEffect
                            text={["Upload Images", "Convert to PDF", "Save in PDF format"]}
                          />
                        </Typography>

                      </>
                    )}
                  </Box>
                )}
              </Grid>

              {preview == true ? (
                <Grid item xs={2} className={styles.editContainer}>
                  {preview == true ? (
                    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "flex-start", alignSelf: "center", paddingLeft: "35px" }}>
                      <Typography variant="h6" sx={{
                        color: "black",
                        fontWeight: "bold",
                        textAlign: "left",
                        marginTop: 3,
                        marginBottom: 2
                      }} component="div" gutterBottom>
                        Edit PDF
                      </Typography>
                      <FormControl sx={{
                        width: "100%",
                      }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                          color: "black"
                        }}>Paper Size</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Page Layout"
                          onChange={handleSizeChange}
                          sx={{
                            color: "white"
                          }}
                        >
                          <MenuItem value={'a4'}>A4</MenuItem>
                          <MenuItem value={'dl'}>dl</MenuItem>
                          <MenuItem value={'letter'}>Letter</MenuItem>
                          <MenuItem value={'government-letter'}>Government-letter</MenuItem>
                          <MenuItem value={'legal'}>Legal</MenuItem>
                          <MenuItem value={'junior-legal'}>Junior Legal</MenuItem>
                          <MenuItem value={'ledger'}>Ledger</MenuItem>
                          <MenuItem value={'tabloid'}>Tabloid</MenuItem>
                          <MenuItem value={'credit-card'}>Credit Card</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth sx={{
                        marginTop: 5,
                      }}>
                        <InputLabel id="demo-simple-select-label" sx={{
                          color: "black"
                        }} >Page Layout</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Page Layout"
                          onChange={handleLayoutChange}
                          sx={{
                            color: "black"
                          }}
                        >
                          <MenuItem value={'p'}>Portrait</MenuItem>
                          <MenuItem value={'l'}>Landscape</MenuItem>
                        </Select>
                      </FormControl>
                      <Grid container spacing={2} sx={{
                        marginBottom: 3
                      }}>
                        <Grid item xs={12}>
                          <InputLabel id="demo-simple-select-label" sx={{
                            marginTop: 5,
                            color: "white"
                          }}>
                            <Typography variant="h6" sx={{
                              color: "black",
                              fontWeight: "bold",
                              textAlign: "left",
                              marginTop: 3,
                              marginBottom: 2
                            }} component="div" gutterBottom>
                              Image Size
                            </Typography></InputLabel>
                        </Grid>
                        <Grid item xs={6} className={styles.imgWidth}>

                          <FormControl fullWidth sx={{
                            color: "white"
                          }} >
                            <TextField

                              id="outlined-required"
                              label="width"
                              defaultValue="210"
                              onChange={handleImgWidth}
                              // color="secondary"
                              className={classes.textField}
                              InputProps={{
                                className: classes.textFieldInput
                              }}
                              InputLabelProps={{
                                className: classes.textField
                              }}
                              SelectProps={{
                                className: classes.borderField
                              }}
                              color="secondary"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} className={styles.imgHeight}>
                          <FormControl sx={{
                            width: "100%",

                          }}>
                            <TextField
                              id="outlined-required"
                              label="height"
                              defaultValue="297"
                              onChange={handleImgHeight}
                              className={classes.textField}
                              InputProps={{
                                className: classes.textFieldInput
                              }}
                              InputLabelProps={{
                                className: classes.textField
                              }}
                              color="secondary"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{
                        marginBottom: 3
                      }}>
                        <Grid item xs={12} sx={{
                          marginBottom: 2
                        }}>
                          <FormControlLabel control={<Switch checked={addFirstPage} onChange={handleFirstPage} />} label="Add First Page" sx={{ color: "black", fontWeight: "bold" }} />
                        </Grid>
                        {addFirstPage ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sx={{
                              marginLeft: 2,
                              marginBottom: 2
                            }}>
                              <FormControl fullWidth >
                                <TextField
                                  required
                                  id="outlined-required"
                                  label="Page Title"
                                  defaultValue="Title"
                                  onChange={handlePageTitle}
                                  className={classes.textField}
                                  InputProps={{
                                    className: classes.textFieldInput
                                  }}
                                  InputLabelProps={{
                                    className: classes.textField
                                  }}
                                  color="secondary"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ marginLeft: 2 }}>
                              <FormControl fullWidth >
                                <TextField
                                  required
                                  id="outlined-required"
                                  label="Font Size"
                                  defaultValue="40"
                                  onChange={handleFontSize}
                                  className={classes.textField}
                                  InputProps={{
                                    className: classes.textFieldInput
                                  }}
                                  InputLabelProps={{
                                    className: classes.textField
                                  }}
                                  color="secondary"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                              <FormControl sx={{
                                width: "100%",
                                marginLeft: 3,
                                marginRight: 3
                              }}>
                                <InputLabel id="demo-simple-select-label" sx={{
                                  color: "black",
                                  fontWeight: "bold"
                                }}>Alignment</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Page Layout"
                                  onChange={handleTitlePosition}
                                  inputMode="numeric"
                                  inputProps={{
                                    className: classes.textFieldInput
                                  }}
                                >
                                  <MenuItem value={'tc'}>Top - Center</MenuItem>
                                  <MenuItem value={'tl'}>Top - Left</MenuItem>
                                  <MenuItem value={'tr'}>Top - Right</MenuItem>
                                  <MenuItem value={'mc'}>Middle - Center</MenuItem>
                                  <MenuItem value={'ml'}>Middle - Left</MenuItem>
                                  <MenuItem value={'mr'}>Middle - Right</MenuItem>
                                  <MenuItem value={'bc'}>Bottom - Center</MenuItem>
                                  <MenuItem value={'bl'}>Bottom - Left</MenuItem>
                                  <MenuItem value={'br'}>Bottom - Right</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        ) : (
                          <>
                          </>
                        )}

                      </Grid>
                      <Button fullWidth variant="contained" onClick={savePdf} sx={{
                        marginTop: 5,
                        width: "100%"
                      }} component="div" startIcon={<SaveIcon />}>
                        Save as PDF
                      </Button>
                    </Box>
                  ) : (
                    <>
                    </>
                  )}

                </Grid>
              ) : (
                <>
                </>
              )}

            </Grid>

          </Box>

        </main>
        <footer className={styles.footer}>
          <Typography variant="h6" sx={{
            color: "#2E1114",
            fontWeight: "bold",
            textAlign: "left",
          }} component="div" gutterBottom>
            Made with ❤️ by Ermiyas Zeleke
          </Typography>
        </footer>
      </div>
    </>
  );
}

export default App;
