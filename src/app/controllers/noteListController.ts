import {ipcMain, BrowserWindow} from "electron"; 

import * as uuid from "uuid/v4";
import * as Path from "path";

// Core
import Message from "../core/message"
import DataManager from "../core/dataManager";
import Editor from "../core/editor";

// Notes
import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

import Controller from "./controller";
import Debug from "../tools/debug"; 
import * as Fuse from "fuse.js";


import {NoteListMode} from "../../enums"
import { BlockOverflowProperty } from "csstype";

export default class NoteListController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);
        ipcMain.on(Message.updateNoteList, (event:any,data:any) => this.updateNoteList());
        ipcMain.on(Message.createNote, (event:any,data:any) => this.actionNewNote());
        ipcMain.on(Message.selectNote, (event:any,data:any) =>{this.actionSelectNote(data);});
        ipcMain.on(Message.removeNote, (event:any,data:any) =>{this.actionRemoveNote(data);});

        ipcMain.on(Message.searchUpdated, (event:any,data:any) => this.actionSearchUpdated(data));
        ipcMain.on(Message.beginQuickSearch , (event:any,data:any) => this.beginQuickSearch(data));
    }

    public updateNoteList():void
    {
        Debug.log("updateNoteList()");

        let mode:number = Editor.instance.noteListMode;

        let selectedNote:string = "";

        if(Editor.instance.selectedNote != null)
        {
            selectedNote = Editor.instance.selectedNote.id;
        }
      
        let notes:Note[] = [];

        let searchData:string="";

        // HERE WE CAN IMPLEMENT A GENERIC FILTER.
        // Like current filter.filter(notes)
        let noteData:any[] = [];

        if(mode == NoteListMode.Search)
        {
            var options = 
            {
                keys: ['title'],
                threshold: 0.4,
                minMatchCharLength: 3,
            }

            //Cache this list.
            notes = DataManager.instance.notes.filter((note:Note)=>
            {
                return (!note.isTrashed);
            });

            noteData = notes.map((note:Note)=>
            {
                return note.GetDataObject();
            });

            var fuse = new Fuse(noteData, options);

            noteData = fuse.search(Editor.instance.searchPhrase);
        }
        else if(mode == NoteListMode.All)
        {
            notes = DataManager.instance.notes.filter((note:Note)=>
            {
                return (!note.isTrashed);
            });
            noteData = notes.map((note:Note)=>
            {
                return note.GetDataObject();
            });
        }
        else if(mode == NoteListMode.Trash)
        {
            notes = Editor.instance.selectedNotebook.notes.filter((note:Note)=>
            {
                return note.isTrashed;
            });
            noteData = notes.map((note:Note)=>
            {
                return note.GetDataObject();
            });
        }
        else if(mode == NoteListMode.Notebook)
        {
            notes = Editor.instance.selectedNotebook.notes.filter((note:Note)=>
            {
                return (!note.isTrashed);
            });
            noteData = notes.map((note:Note)=>
            {
                return note.GetDataObject();
            });
        }
        else if(mode == NoteListMode.Started)
        {
            notes = Editor.instance.selectedNotebook.notes.filter((note:Note)=>
            {
                return note.isStarted;
            });
            noteData = notes.map((note:Note)=>
            {
                return note.GetDataObject();
            });
        }
        
        let forceUpdate:boolean = true;

        let data =
        {
            notes:noteData,
            mode:mode,
            selectedNote:selectedNote,
            search:searchData,
            forceUpdate:(forceUpdate)?Math.random():0
        }

        this.sendUIMessage(Message.updateNoteList, data);
    }

    private beginQuickSearch(data:any):void
    {
        this.sendUIMessage(Message.beginQuickSearch);
    }

    private actionSearchUpdated(data:any):void
    {
        let mode:number = Editor.instance.noteListMode;

        if(mode == NoteListMode.Search)
        {
            if(data == "")
            {
                Editor.instance.cancelSearch(data);
            }
            else
            {
                Editor.instance.updateSearch(data);
            }
        }
        else
        {
            if(data != "")
            {
                Editor.instance.beginSearch(data);
            }
        }
    }

    private actionNewNote():void
    {
        let selectedNotebook = Editor.instance.selectedNotebook;

        if(selectedNotebook != null)
        {
            let note:Note = Note.create(uuid(), Path.join(selectedNotebook.folderPath,selectedNotebook.id));
            
            if(DataManager.instance.addNote(note))
            {
                DataManager.instance.saveNote(note);
                selectedNotebook.addNote(note);
                Editor.instance.selectNote(note.id);
                this.updateNoteList();
            }
        }
    }

    private actionRemoveNote(data:any):void
    {
        let note:Note = DataManager.instance.getNote(data.noteId);

        if(note!=null)
        {
            if(Editor.instance.selectedNote == note)
            {
                Editor.instance.unselectNotebook();
            }

            if(note.isTrashed)
            {
                DataManager.instance.deleteNote(note);
            }
            else
            {
                note.setTrashed(true);
                DataManager.instance.saveNote(note);
            }
            
            Editor.instance.updateNoteList();
            Editor.instance.updateNoteView();
        }
    }

    private actionSelectNote(data:any):void
    {
        Editor.instance.selectNote(data.noteId);
    }
}