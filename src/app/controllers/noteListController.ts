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
        let editorMode = Editor.instance.noteListMode;

        if(editorMode == NoteListMode.Notebook)
        {
            this.sendUIMessage(Message.updateNoteList,{mode: editorMode});
        }
        else if(editorMode == NoteListMode.All)
        {
            this.sendUIMessage(Message.updateNoteList,{mode: editorMode});
        }
        else if(editorMode == NoteListMode.Started)
        {
            this.sendUIMessage(Message.updateNoteList,{mode: editorMode, notes:[]});
        }  
        else if(editorMode == NoteListMode.Trash)
        {
            this.sendUIMessage(Message.updateNoteList,{mode: editorMode, notes:[]});
        }

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