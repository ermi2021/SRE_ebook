import React, { ChangeEventHandler, useState, useEffect } from "react";

import * as Helpers from "./helpers";
import { CustomImage } from "./custom-image";
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
import { Blob } from 'react-blob';
import jsPDF from "jspdf";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ReactTypingEffect from 'react-typing-effect';
import SaveIcon from '@mui/icons-material/Save';
import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    //width: "25ch",
    color: "white",
    borderColor: "white"
  },
  textFieldInput: {
    color: "white",
    borderColor: "white",
    fontWeight: "bold"
  },
  borderField: {
    borderColor: "white"
  }
}));


function App() {
  const [uploadedImages, setUploadedImages] = React.useState<CustomImage[]>([]);
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

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

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



  useEffect(() => {
    setPdf(Helpers.generatePdfFromImages(uploadedImages, width, height, layout, pageSize, addFirstPage, pageTitle, fontSize, titlePosition));
  }, [uploadedImages, layout, pageSize, width, height, addFirstPage, pageTitle, fontSize, titlePosition])

  useEffect(() => {
    setPdfUrl(pdfBlob.output("bloburl"));
  }, [pdfBlob])

  const handleImageUpload = React.useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const fileList = event.target.files;
      const fileArray = fileList ? Array.from(fileList) : [];
      const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);
      Promise.all(fileToImagePromises).then(setUploadedImages);
    },
    [setUploadedImages]
  );


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
                    <Image
                      src="/../public/sre_icon.png"
                      width="100"
                      height="60" />
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                      control={<MaterialUISwitch sx={{ m: 1 }} checked={nightMode} onChange={handleNightMode} />}
                      label=""
                    />

                  </FormGroup>
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
                    <Image
                      src="/../public/sre_icon.png"
                      width="100"
                      height="60" />
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<MaterialUISwitch sx={{ m: 1 }} checked={nightMode} onChange={handleNightMode} />}
                      label=""
                    />
                  </FormGroup>
                </Toolbar>
              </AppBar>
            )}


            <Grid container spacing={2} className={styles.mainGrid}>
              <Grid item xs={3.5} className={styles.uploadContainer}>
                <Stack direction="row" alignItems="left" sx={{
                  marginY: 4
                }} spacing={2}>
                  <label htmlFor="file-input">
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      multiple
                    />
                    <Button variant="contained" component="span">
                      Upload Image/s
                    </Button>
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>

                </Stack>
                {uploadedImages.length > 0 ? (
                  <Box sx={{ width: 500, height: 650, overflowY: 'scroll' }} >
                    <ImageList cols={3} gap={8}>
                      {uploadedImages.map((image) => (
                        <ImageListItem key={image.src} className="styles.imageListContainer">
                          <img
                            src={image.src}
                            srcSet={image.src}
                            alt="uploaded Image"
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
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
                  <Button fullWidth variant="contained" onClick={handlePreviewChange} sx={{
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
                  <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center" }}>
                    {nightMode == true ? (
                      <>
                        <Typography variant="h4" sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: "80%",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          Welcome to SRE E-BOOK MAKER
                        </Typography>
                        <Typography variant="h3" sx={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center"
                        }} component="div" gutterBottom>
                          <ReactTypingEffect
                            text={["Upload Images", "Convert to PDF", "Save in PDF format"]}
                          />
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="h4" sx={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: "80%",
                          alignSelf: "center"

                        }} component="div" gutterBottom>
                          Welcome to SRE E-BOOK MAKER
                        </Typography>
                        <Typography variant="h3" sx={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center"
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
                        color: "white",
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
                          color: "white"
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
                          color: "white"
                        }} >Page Layout</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Page Layout"
                          onChange={handleLayoutChange}
                          sx={{
                            color: "white"
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
                              color: "white",
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
                          <FormControlLabel control={<Switch checked={addFirstPage} onChange={handleFirstPage} />} label="Add First Page" sx={{ color: "white", fontWeight: "bold" }} />
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
                                  color: "white"
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
                        width: "80%"
                      }} component="div" startIcon={<SaveIcon />}>
                        Save PDF
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
            color: "white",
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
