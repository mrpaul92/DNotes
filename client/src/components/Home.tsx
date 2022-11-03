import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { AppBar, Avatar, Box, Button, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import { Add, EventNote, Fingerprint, Delete as DeleteIcon, Folder as FolderIcon, StickyNote2 } from "@mui/icons-material";
import { ethers, utils } from "ethers";
import { DNotesApi } from "../api";
import { userActions } from "../store/slices/userSlice";
import { contractSymbol } from "../constants";

const getEthereumObject = () => (window as any).ethereum;
const ethereum = getEthereumObject();

const Home = () => {
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);

  const updateTitleRef = useRef<HTMLInputElement>(null);
  const updateBodyRef = useRef<HTMLInputElement>(null);

  const [balance, setBalance] = useState("");
  const [view, setView] = useState("list");
  const [useEffectTrigger, setUseEffectTrigger] = useState(false);
  const [formError, setFormError] = useState(false);

  const [noteUpdateData, setNoteUpdateData] = useState({ data: { id: 0, title: "", body: "" } });

  const name = useSelector((state: RootState) => state.user.name);
  const key = useSelector((state: RootState) => state.user.key);
  const notes = useSelector((state: RootState) => state.user.notes);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    provider
      .getBalance(key)
      .then((balance) => {
        const bal = utils.formatEther(balance.toString());
        setBalance(bal);

        // get notes
        getNotes();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [useEffectTrigger]);

  const handleAddNote = async () => {
    if (titleRef.current?.value && bodyRef.current?.value) {
      await DNotesApi.addNote(titleRef.current?.value, bodyRef.current?.value, []);
      titleRef.current.value = "";
      bodyRef.current.value = "";
      setView("list");
      setUseEffectTrigger(!useEffectTrigger);
    } else {
      setFormError(true);
    }
  };

  const handleUpdateNote = async () => {
    if (updateTitleRef.current?.value && updateBodyRef.current?.value) {
      await DNotesApi.updateNote(noteUpdateData.data.id, updateTitleRef.current?.value, updateBodyRef.current?.value);
      updateTitleRef.current.value = "";
      updateBodyRef.current.value = "";
      setView("list");
      setUseEffectTrigger(!useEffectTrigger);
    } else {
      setFormError(true);
    }
  };

  const handleOpenAddNote = async () => {
    setView("form");
  };

  const deleteNote = async (id: number) => {
    await DNotesApi.deleteNote(id);
    setUseEffectTrigger(!useEffectTrigger);
  };

  const handleOpenUpdateNote = async (id: number, title: string, body: string) => {
    setNoteUpdateData({ data: { id, title, body } });
    setView("update");
  };

  const getNotes = async () => {
    const allNotes = await DNotesApi.getNotes();
    const formattedNotes = allNotes.map((note) => {
      return {
        id: Number(note.id),
        title: note.title,
        body: note.body,
        status: note.status,
        timestamp: Number(note.timestamp),
      };
    });
    dispatch(userActions.setNotes({ notes: formattedNotes }));
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <EventNote sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              DNotes
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

            <Box sx={{ flexGrow: 0 }}>
              <div style={{ color: "white", fontSize: "14px", textAlign: "right", fontWeight: "bold" }}>{name}</div>
              <div style={{ color: "white", fontSize: "10px" }}>{key}</div>
              <div style={{ color: "white", fontSize: "10px", textAlign: "right", fontWeight: "bold" }}>
                {contractSymbol} {Number(balance).toFixed(4)}
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        {view === "list" && (
          <>
            <div style={{ margin: "20px auto", textAlign: "center" }}>
              <Button variant="outlined" startIcon={<Add />} onClick={handleOpenAddNote}>
                Add New Note
              </Button>
            </div>
            <div className="notesContainer">
              <List dense={true}>
                {notes.map((note: any) => (
                  <ListItem
                    key={note.id}
                    secondaryAction={
                      <IconButton
                        color="warning"
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          deleteNote(note.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <StickyNote2 />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={note.title}
                      secondary={note.body}
                      onClick={() => {
                        handleOpenUpdateNote(note.id, note.title, note.body);
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          </>
        )}

        {view === "form" && (
          <>
            <div style={{ margin: "20px auto", textAlign: "center" }}>
              <Box sx={{ m: 2 }}>
                <TextField error={formError} id="outlined-error" inputRef={titleRef} required label="Enter Title" style={{ width: "100%" }} />
              </Box>
              <Box sx={{ m: 2 }}>
                <TextField error={formError} id="outlined-error" multiline rows={4} inputRef={bodyRef} required label="Enter Note Content" style={{ width: "100%" }} />
              </Box>
              <Box sx={{ m: 3 }}>
                <Button variant="outlined" onClick={handleAddNote}>
                  Add Note
                </Button>
              </Box>
            </div>
          </>
        )}

        {view === "update" && (
          <>
            <div style={{ margin: "20px auto", textAlign: "center" }}>
              <Box sx={{ m: 2 }}>
                <TextField error={formError} id="outlined-error" inputRef={updateTitleRef} required label="Enter Title" style={{ width: "100%" }} defaultValue={noteUpdateData.data.title} />
              </Box>
              <Box sx={{ m: 2 }}>
                <TextField
                  error={formError}
                  id="outlined-error"
                  multiline
                  rows={4}
                  inputRef={updateBodyRef}
                  required
                  label="Enter Note Content"
                  style={{ width: "100%" }}
                  defaultValue={noteUpdateData.data.body}
                />
              </Box>
              <Box sx={{ m: 3 }}>
                <Button variant="outlined" onClick={handleUpdateNote}>
                  Update Note
                </Button>
              </Box>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
