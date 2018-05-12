
import {ipcMain} from "electron"; 
import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";
import Message from "./message";

export default class Editor
{
    // Singleton
    private static sInstance:Editor;

    // Get/Set
    static get instance(): Editor 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new Editor();
    }

    // Member Variables
    private _selectedNotebook:Notebook;
    private _selectedNote:Note;

    //Get/Set
    get selectedNotebook(): Notebook 
    {
        return this._selectedNotebook;
    }

    get selectedNote(): Note 
    {
        return this._selectedNote;
    }

    // Member Functions
    private constructor()
    {
        this.intializeContextVariables();
    }

    private intializeContextVariables():void
    {
        let storages = DataManager.instance.noteStorages;
        if(storages.length > 0)
        {
            let notebooks = storages[0].notebooks;

            if(notebooks.length > 0)
            {
                this._selectedNotebook = notebooks[0];
                this._selectedNotebook.SetAsSelected();
                
                if(this._selectedNotebook.notes.length>0)
                {
                    this._selectedNote = this._selectedNotebook.notes[0];
                    this._selectedNote.SetAsSelected();
                }
            }
        }
    }

    ///////////
    //Actions
    public unselectNotebook():void
    {
        if( this._selectedNotebook!=null)
        {
            let shouldUpdateNoteView:boolean = (this._selectedNote.parent == this._selectedNotebook);
            
            this._selectedNotebook.SetAsUnselected();
            this._selectedNotebook = null;

            ipcMain.emit(Message.updateLeftPanel);
            ipcMain.emit(Message.updateNoteList);

            if(shouldUpdateNoteView)
            {
                ipcMain.emit(Message.updateNoteView);
            }
       
        }
    }

    public selectNotebook(notebookId:string):void
    {
        if( this._selectedNotebook!=null)
        {
            this._selectedNotebook.SetAsUnselected();
            this._selectedNotebook = null;
        }

        let notebook:Notebook = DataManager.instance.getNotebook(notebookId);

        if(notebook != null)
        {
            this._selectedNotebook = notebook;
            this._selectedNotebook.SetAsSelected();

            if(this._selectedNotebook.notes.length > 0)
            {
                let note = this._selectedNotebook.notes[0];
                this.selectNote(note.id);
            }

            ipcMain.emit(Message.updateLeftPanel);
            ipcMain.emit(Message.updateNoteList);
        }
    }

    public selectNote(noteId:string):void
    {
        console.log("Note Selected: "+noteId);
           
        if( this._selectedNote != null)
        {
            this._selectedNote.SetAsUnselected();
            this._selectedNote = null;
        }

        let note:Note = DataManager.instance.getNote(noteId);

        if(note != null)
        {
            this._selectedNote = note;
            this._selectedNote.SetAsSelected();

            ipcMain.emit(Message.updateNoteList);
            ipcMain.emit(Message.updateNoteView);
        }
    }
    
}