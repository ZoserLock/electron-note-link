
import {ipcMain} from "electron"; 
import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

export default class Director
{
    // Singleton
    private static sInstance:Director;

    // Get/Set
    static get instance(): Director 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new Director();
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

        // Update Events
        ipcMain.on("update:LeftPanel",()=>this.updateLeftPanel());
        ipcMain.on("update:NoteList" ,()=>this.updateNoteList());
        ipcMain.on("update:Toolbar"  ,()=>this.updateToolbar());
        ipcMain.on("update:Statusbar",()=>this.updateStatusbar());

        // User Events
        ipcMain.on("action:NewNote",()=>this.actionNewNote());
        ipcMain.on("action:NewNotebook",(event:any,data:any)=>this.actionNewNotebook(event,data));
        ipcMain.on("action:NewNotebookStorage",()=>this.actionNewNotebookStorage());

        // Notebook
        ipcMain.on("action:SelectNotebook",(event:any,data:any)=>this.actionSelectNotebook(event,data));
        ipcMain.on("action:SelectNote",(event:any,data:any)=>this.actionSelectNote(event,data));
    }

    private intializeContextVariables():void
    {
        if( this._selectedNotebook!=null)
        {
            this._selectedNotebook.SetAsUnselected();
            this._selectedNotebook = null;
        }

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
    // Update Function

    public updateLeftPanel():void
    {
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;

        let selectedNotebookId:String = "";

        if(this._selectedNotebook != null)
        {
            selectedNotebookId = this._selectedNotebook.id;
        }

        Application.instance.sendUIMessage("update:LeftPanel",{storages:storages, selectedNotebookId:selectedNotebookId});
    }

    public updateNoteList():void
    {
        let notes:Note[] = [];

        if(this._selectedNotebook != null)
        {
            notes = this._selectedNotebook.notes;
        }

        Application.instance.sendUIMessage("update:NoteList",{notes:notes});
    }

    public updateNoteView():void
    {
        Application.instance.sendUIMessage("update:NoteView",{notes:this._selectedNotebook.notes});
    }
    
    public updateToolbar():void
    {
        // To be implemented
    }

    public updateStatusbar():void
    {
        // To be implemented
    }


    ///////////
    //Actions
    private actionNewNotebookStorage():void
    {
        let storage = NotebookStorage.create(uuid(),"E:/Tests/NoteLinkData");

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        this.updateLeftPanel();
    }
    
    private actionNewNotebook(event:any, data:any):void
    {
        let storageId = data.storage;

        let storage:NotebookStorage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), Path.join(storage.folderPath,"/notebooks"));

            if(DataManager.instance.saveNotebook(notebook))
            {
                DataManager.instance.addNotebook(notebook);
                storage.addNotebook(notebook);
                DataManager.instance.saveStorage(storage);
            }

            this.updateLeftPanel();
        }
        else
        {
            Debug.logError("storage does not exist");
        }
    }

    private actionNewNote():void
    {
        if(this._selectedNotebook != null)
        {
            let note:Note = Note.create(uuid(), Path.join(this._selectedNotebook.folderPath,this._selectedNotebook.id));
            
            if(DataManager.instance.addNote(note))
            {
                DataManager.instance.saveNote(note);
                this._selectedNotebook.addNote(note);
                this.updateNoteList();
            }
        }
    }

    private actionSelectNotebook(event:any, data:any):void
    {
        if( this._selectedNotebook!=null)
        {
            this._selectedNotebook.SetAsUnselected();
            this._selectedNotebook = null;
        }

        let notebook:Notebook = DataManager.instance.getNotebook(data.notebookId);

        if(notebook!=null)
        {
            this._selectedNotebook = notebook;
            this._selectedNotebook.SetAsSelected();

            if(this._selectedNotebook.notes.length > 0)
            {
                if( this._selectedNote != null)
                {
                    this._selectedNote.SetAsUnselected();
                    this._selectedNote = null;
                }

                let note = this._selectedNotebook.notes[0];

                this._selectedNote = note;
                this._selectedNote.SetAsSelected();
                this.updateNoteView();
            }


            this.updateLeftPanel();
            this.updateNoteList();

   

        }
    }

    private actionSelectNote(event:any, data:any):void
    {

        if( this._selectedNote != null)
        {
            this._selectedNote.SetAsUnselected();
            this._selectedNote = null;
        }

        let note:Note = DataManager.instance.getNote(data.noteId);

        if(note != null)
        {
            this._selectedNote = note;
            this._selectedNote.SetAsSelected();

            this.updateNoteList();
            this.updateNoteView();
        }
    }


  
}