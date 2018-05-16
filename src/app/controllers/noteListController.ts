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

import {NoteListMode} from "../../enums"

export default class NoteListController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);
        ipcMain.on(Message.updateNoteList ,() => this.updateNoteList());
        ipcMain.on(Message.createNote     ,() => this.actionNewNote());
        ipcMain.on(Message.searchUpdated  ,(event:any,data:any) => this.actionSearchUpdated(data));

        ipcMain.on(Message.selectNote, (event:any,data:any) =>{this.actionSelectNote(data);});



    }

    public updateNoteList():void
    {
        let mode:number = Editor.instance.noteListMode;

        let selectedNote:string = "";

        if(Editor.instance.selectedNote != null)
        {
            selectedNote = Editor.instance.selectedNote.id;
        }
      
        let notes:Note[] = [];

        // HERE WE CAN IMPLEMENT A GENERIC FILTER.

        if(mode == NoteListMode.All)
        {
            notes = DataManager.instance.notes.filter((note:Note)=>
            {
                return (!note.isTrashed);
            });
        }
        if(mode == NoteListMode.Notebook)
        {
            notes = Editor.instance.selectedNotebook.notes;
        }

        let noteData:any[] = notes.map((note:Note)=>
        {
            return note.GetDataObject();
        });

        let data =
        {
            notes:noteData,
            mode:mode,
            selectedNote:selectedNote
        }

        Debug.log("Selected Note: "+data.selectedNote);
        this.sendUIMessage(Message.updateNoteList, data);
    }

    private actionSearchUpdated(data:any):void
    {
        Debug.log("Search Updated");
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

    private actionSelectNote(data:any):void
    {
        Editor.instance.selectNote(data.noteId);
    }
}