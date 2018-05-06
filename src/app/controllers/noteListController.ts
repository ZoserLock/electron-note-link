import {ipcMain, BrowserWindow} from "electron"; 

import * as uuid from "uuid/v4";
import * as Path from "path";

// Core
import Message from "../core/message"
import DataManager from "../core/dataManager";
import Director from "../core/director";

// Notes
import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

import Controller from "./controller";
import Debug from "../tools/debug";

export default class NoteListController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);
        ipcMain.on(Message.updateNoteList ,() => this.updateNoteList());
        ipcMain.on(Message.newNote        ,() => this.actionNewNote());

        ipcMain.on(Message.selectNote, (event:any,data:any) =>{this.actionSelectNote(data);});


    }

    public updateNoteList():void
    {
        Debug.log("updateNoteList!>!!");
        let selectedNotebook = Director.instance.selectedNotebook;

        let notes:Note[] = [];

        if(selectedNotebook != null)
        {
            notes = selectedNotebook.notes;
        }

        this.sendUIMessage(Message.updateNoteList,{notes:notes});
    }

    private actionNewNote():void
    {
        let selectedNotebook = Director.instance.selectedNotebook;

        if(selectedNotebook != null)
        {
            let note:Note = Note.create(uuid(), Path.join(selectedNotebook.folderPath,selectedNotebook.id));
            
            if(DataManager.instance.addNote(note))
            {
                DataManager.instance.saveNote(note);
                selectedNotebook.addNote(note);
                this.updateNoteList();
            }
        }
    }
    private actionSelectNote(data:any):void
    {
        Director.instance.selectNote(data.noteId);
    }
}