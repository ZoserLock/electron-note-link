
import {ipcRenderer} from "electron"; 
import Message from "../core/message";

import {CacheAction,NoteListMode} from "../../enums"
import Debug from "../tools/debug";
import { debug } from "util";

interface Dictionary 
{
    [id: string]: any;
}

export default class UICache
{
    // Singleton
    private static sInstance:UICache;

    // Get/Set
    static get instance(): UICache 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new UICache();
    }

    // Data Lists
    private _storageList: any[] = [];
    private _notebookList: any[] = [];
    private _noteList: any[] = [];

    // Data maps
    private _storages: Dictionary ={};
    private _notebooks: Dictionary = {};
    private _notes: Dictionary = {};

    // Editor Status
    private _selectedNote: string;
    private _selectedNotebook: string;
    private _noteListMode:number;

    get noteStorages(): any[]
    {
        return this._storageList;
    }

    get notebooks(): any[]
    {
        return this._notebookList;
    }

    get notes(): any[]
    {
        return this._noteList;
    }


    get selectedNote(): string
    {
        return this._selectedNote;
    }
    
    get selectedNotebook(): string
    {
        return this._selectedNotebook;
    }

    get noteListMode(): number
    {
        return this._noteListMode;
    }

    private constructor()
    {
        Debug.log("UICache Created")
        ipcRenderer.on(Message.cacheUpdate  ,(event:any,data:any) => this.updateCache(data));
        ipcRenderer.on(Message.cacheGenerate  ,(event:any,data:any) => this.generateCache(data));
        ipcRenderer.on(Message.cacheUpdateEditorStatus  ,(event:any,data:any) => this.updateEditorStatus(data));

        this._noteListMode = NoteListMode.Notebook;
        this._selectedNote = "";
        this._selectedNotebook = "";
    }

    // UI actions

    private registerStorage(storage:any):void
    {
        this._storages[storage.id] = storage;
        this._storageList.push(storage);
    }

    private unregisterStorage(storage:any):void
    {
        delete this._storages[storage.id];

        for(let a = 0;a < this._storageList.length ;++a)
        {
            if(this._storageList[a] == storage)
            {
                this._storageList.splice(a,1);
                break;
            }
        }
    }

    private registerNotebook(notebook:any):void
    {
        this._notebooks[notebook.id] = notebook;
        this._notebookList.push(notebook);
    }
    
    private unregisterNotebook(notebook:any):void
    {
        for(let a = 0;a < this._notebookList.length ;++a)
        {
            if(this._notebookList[a] == notebook)
            {
                this._notebookList.splice(a,1);
                break;
            }
        }

        delete this._notebooks[notebook.id];
    }

    private registerNote(note:any):void
    {
        this._notes[note.id] = note;
        this._noteList.push(note);
    }

    private unegisterNote(note:any):void
    {
        for(let a = 0;a < this._noteList.length ;++a)
        {
            if(this._noteList[a] == note)
            {
                this._noteList.splice(a,1);
                break;
            }
        }

        delete this._notes[note.id];
    }
    public getStorage(id:string):any
    {
        if(this._storages[id] != undefined)
        {
            return this._storages[id];
        }

        return null;
    }

    public getNotebook(id:string):any
    {
        if(this._notebooks[id] != undefined)
        {
            return this._notebooks[id];
        }

        return null;
    }

    public getNote(id:string):any
    {
        if(this._notes[id] != undefined)
        {
            return this._notes[id];
        }

        return null;
    }

    public getSelectedNotebook():any
    {
        let notebook:any = this.getNotebook(this._selectedNotebook);

        return notebook;
    }
    // Cache related:

    public generateCache(data:any):void
    {
        console.time("Generate Cache");
        let storages  = data.storages;
        let notebooks = data.notebooks;
        let notes     = data.notes;

        for(let storage of storages)
        {
            this.updateStorageData(storage)
        }

        for(let notebook of notebooks)
        {
            this.updateNotebookData(notebook)
        }

        for(let note of notes)
        {
            this.updateNoteData(note)
        }

        // Link notebooks
        for(let storage of this._storageList)
        {
            storage.notebooks=[];
            for(let notebookId of storage.notebookIds)
            {
                let notebook:any= this.getNotebook(notebookId);
                if(notebook!=null)
                {
                    storage.notebooks.push(notebook);
                }
            }
        }

        // Link Notes
        for(let notebook of this._notebookList)
        {
            notebook.notes = [];
            for(let noteId of notebook.noteIds)
            {
                let note:any = this.getNote(noteId);
                if(note!=null)
                {
                    notebook.notes.push(note);
                }
            }
        }

        console.timeEnd("Generate Cache");
    }

    public updateStorageData(storageData:any):void
    {
        let storage:any = this.getStorage(storageData.id);

        if(storage == null)
        {
            storage = 
            {
                id:storageData.id,
                name:storageData.name,
                notebookIds:storageData.notebooks
            }

            this.registerStorage(storage);
        }
        else
        {
            storage.id           = storageData.id;
            storage.name         = storageData.name;
            storage.notebookIds  = storageData.notebooks;
        }
    }

    public updateNotebookData(notebookData:any):void
    {
        let notebook:any = this.getNotebook(notebookData.id);

        if(notebook == null)
        {
            notebook = 
            {
                id:notebookData.id,
                name:notebookData.name,
                noteIds:notebookData.notes
            }

            this.registerNotebook(notebook);
        }
        else
        {
            notebook.id      = notebookData.id;
            notebook.name    = notebookData.name;
            notebook.noteIds = notebookData.notes;
        }
    }
    
    public updateNoteData(noteData:any):void
    {
        let note:any = this.getNote(noteData.id);
        if(note == null)
        {
            note = 
            {
                id:noteData.id,
                title:noteData.title,
                text:noteData.text
            }

            this.registerNote(note);
        }
        else
        {
            note.id     = noteData.id;
            note.title  = noteData.title;
            note.text   = noteData.text;
        }
    }

    public updateEditorStatus(data:any):void
    {
        let note:any     = this.getNote(data.selectedNote);
        let notebook:any = this.getNotebook(data.selectedNotebook);

        this._selectedNote     = (note!=null)?note.id:"";
        this._selectedNotebook = (notebook!=null)?notebook.id:"";
        this._noteListMode = data.noteListMode;


    }

    public updateCache(data:any):void
    {
        let cacheAction:number = data.action;

        switch(cacheAction)
        {
            case CacheAction.UpdateStorage:

            break;
            case CacheAction.UpdateNotebook:

            break;
            case CacheAction.UpdateNote:

            break;
        }
    }
}