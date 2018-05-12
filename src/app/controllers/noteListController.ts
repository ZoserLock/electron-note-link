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
        let selectedNotebook = Editor.instance.selectedNotebook;

        let notes:any[] = [];

        if(selectedNotebook != null)
        {
            for(let note of selectedNotebook.notes)
            {
                notes.push(note.GetDataObject());
            }
        }

        this.sendUIMessage(Message.updateNoteList,{notes:notes});
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

    private actionNewNote_stress():void
    {
        for(let a = 0;a < 500; ++a)
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
                }
            }
        }
        
        this.updateNoteList();
    }

    private actionSelectNote(data:any):void
    {
        Editor.instance.selectNote(data.noteId);
    }
}