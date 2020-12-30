import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "./firebase";
import {
  Modal,
  Button,
  TextField,
  LinearProgress,
  IconButton,
  makeStyles,
  FormControlLabel,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "../css/ImageUpload.css";
import Switch from "@material-ui/core/Switch";

const allFailTypes = [
  "betrayal",
  "health issues",
  "financial crisis",
  "poor performance",
  "boredom",
  "confusion",
  "unfair treatment",
  "career pressure",
  "uncracked interview",
  "uncracked entrance exam",
  "no passion",
  "failed relations",
  "zero knowledge",
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips__container: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  input: {
    marginBottom: "1rem",
  },
  switch: {
    marginRight: "auto",
  },
}));

function ImageUpload({ username, email }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [fail, setFail] = useState([]);
  const [checked, setChecked] = useState({
    checkedA: false,
  });

  console.log(checked);

  const handleChange = (e) => {
    setFail((fail) => [...fail, e.target.value]);
  };

  const handleFileChange = (e) => {
    if (e.target?.files[0]) setImage(e.target.files[0]);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!image) {
      db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        title,
        caption,
        userName: checked.checkedA ? "Anonymous" : username,
        failTags: fail,
        userEmail: email,
        likesCount: 0,
        commentsCount: 0,
      });
      setTitle("");
      setCaption("");
      setFail([]);
      setChecked({ checkedA: false });
      handleClose();
      return;
    }

    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              title,
              caption,
              imageURL: url,
              userName: username,
              userEmail: email,
              failTags: fail,
            });

            setImage(null);
            setProgress(true);
            setCaption("");
            setFail([]);
            handleClose();
          });
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setProgress(null);
  };

  const handleChipDelete = (toBeDeletedFail) => {
    setFail((fail) => fail.filter((eachFail) => eachFail !== toBeDeletedFail));
  };

  const handleChangeAnonymous = (event) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  console.log();

  return (
    <div className="imageUpload">
      <div
        className="writePost__container"
        style={{ zIndex: 9999 }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="writePost__main">
          <IconButton>
            <i className="fas fa-edit"></i>
          </IconButton>
          <p>Tell us your story...</p>
        </div>
      </div>
      <Modal className="modal" open={open} onClose={handleClose}>
        <div>
          <form className="modal__body" onSubmit={handleFileUpload}>
            <h2 style={{ marginRight: "auto", marginBottom: "1rem" }}>
              Create A Post
            </h2>
            <TextField
              className={classes.input}
              required
              type="text"
              id="title"
              fullWidth
              label="Title of your fail"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              className={classes.input}
              required
              type="text"
              id="capiton"
              fullWidth
              label="Enter your story..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className={classes.chips__container}>
              {fail.length > 0 &&
                fail.map((eachFail) => (
                  <Chip
                    key={`${eachFail}-${Math.round(Math.random() * 999999)}`}
                    color="primary"
                    label={eachFail}
                    onDelete={() => handleChipDelete(eachFail)}
                  />
                ))}
            </div>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">
                Potential reasons / relevant tags for failure
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={""}
                onChange={handleChange}
              >
                {allFailTypes.map((eachFail) => (
                  <MenuItem
                    key={`${eachFail}-${Math.round(Math.random() * 999999)}`}
                    value={eachFail}
                  >
                    {eachFail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              className={classes.switch}
              control={
                <Switch
                  checked={checked.checkedA}
                  onChange={handleChangeAnonymous}
                  name="checkedA"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label="Post anonymously"
            />

            <div className="modal__formButtons">
              <Button component="label" variant="outlined" color="secondary">
                Choose File *
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                submit
              </Button>
            </div>
            {image ? (
              <div className="imageUpload__text">
                <span>
                  file choosen <i>{image?.name}</i>
                </span>
              </div>
            ) : null}
            {progress > 0 && (
              <div
                style={{ width: "100%", display: "block", marginTop: "2rem" }}
              >
                <LinearProgress
                  variant="determinate"
                  value={50}
                  className="imageUpload__progress"
                  max="100"
                />
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ImageUpload;
