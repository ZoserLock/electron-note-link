
import {ipcMain} from "electron"; 
import * as process from "process";
import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";
import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";
import Message from "./message";

import {NoteListMode,EditorPendingUpdate} from "../../enums"

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

    // Editor Status
    private _noteListMode:NoteListMode;

    private _selectedNotebook:Notebook;

    private _selectedNote:Note;

    // Search Data
    private _searchPhrase = "";

    // Update Status
    private _willUpdateNextTick:boolean   = false;
    private _pendingUpdate:number = EditorPendingUpdate.None;

    ///////////
    //Get/Set
    get noteListMode(): number 
    {
        return this._noteListMode;
    }

    get selectedNotebook(): Notebook 
    {
        return this._selectedNotebook;
    }

    get selectedNote(): Note 
    {
        return this._selectedNote;
    }

    get searchPhrase(): string 
    {
        return this._searchPhrase;
    }

    // Member Functions
    private constructor()
    {
        
    }

    public initializeEditorStatus():void
    {
        this._noteListMode = NoteListMode.Notebook; 

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

    public beginQuickSearch():void
    {
        ipcMain.emit(Message.beginQuickSearch);
    }

    // Search

    public beginSearch(search:string):void
    {
        this._searchPhrase = search;

        this.setNoteListMode(NoteListMode.Search);
    }

    public updateSearch(search:string):void
    {
        this._searchPhrase = search;
        this.updateNoteList();
    }

    public cancelSearch(search:string):void
    {
        this._searchPhrase = "";
        this.setNoteListMode(NoteListMode.Notebook);
    }
    
    ///////////
    //UpdateActions
    public updateAll():void
    {
        this.updateLeftPanel();
        this.updateNoteList();
        this.updateNoteView();
    }

    public updateLeftPanel():void
    {
        this._pendingUpdate |= EditorPendingUpdate.LeftPanel;
        this.tryUpdateNextTick();
    }

    public updateNoteList():void
    {
        this._pendingUpdate |= EditorPendingUpdate.NoteList;
        this.tryUpdateNextTick();
    }

    public updateNoteView():void
    {
        this._pendingUpdate |= EditorPendingUpdate.NoteView;
        this.tryUpdateNextTick();
    }

    private tryUpdateNextTick():void
    {
        if(!this._willUpdateNextTick)
        {
            process.nextTick(()=>this.onNextTick());
            this._willUpdateNextTick=true;
        }
    }
    
    private onNextTick():void
    {
        if((this._pendingUpdate & EditorPendingUpdate.LeftPanel)!=0)
        {
            ipcMain.emit(Message.updateLeftPanel);
        }

        if((this._pendingUpdate & EditorPendingUpdate.NoteList)!=0)
        {
            ipcMain.emit(Message.updateNoteList);
        }

        if((this._pendingUpdate & EditorPendingUpdate.NoteView)!=0)
        {
            ipcMain.emit(Message.updateNoteView);
        }

        this._willUpdateNextTick = false;
        this._pendingUpdate = EditorPendingUpdate.None;
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

            this.updateLeftPanel();
            this.updateNoteList();

            if(shouldUpdateNoteView)
            {
                this.updateNoteView();
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

            this.updateLeftPanel();
            this.updateNoteList();
        }

        this.setNoteListMode(NoteListMode.Notebook);
    }

    public setNoteListMode(mode:number):void
    {
        if(mode != this._noteListMode)
        {
            Debug.log("setNoteListMode: "+mode);
            this._noteListMode = mode;

            this.updateLeftPanel();
            this.updateNoteList();
        }
    }

    public unselectNote():void
    {
        if( this._selectedNote!=null)
        {
            this._selectedNote.SetAsUnselected();
            this._selectedNote = null;

            this.updateNoteList();
            this.updateNoteView();
        }
    }

    public selectNote(noteId:string):boolean
    {
        if(this._selectedNote != null && this._selectedNote.id == noteId)
        {
            return false;
        }

        let note:Note = DataManager.instance.getNote(noteId);

        if(note != null)
        {
            if( this._selectedNote != null)
            {
                this._selectedNote.SetAsUnselected();
                this._selectedNote = null;
            }
    
            this._selectedNote = note;
            this._selectedNote.SetAsSelected();

            this.updateNoteView();
            this.updateNoteList();
            return true;
        }
        return false;
    }

    public selectNoteNotebook(noteId:string):void
    {
        let note:Note = DataManager.instance.getNote(noteId);

        if(note != null)
        {
            this.selectNotebook(note.parent.id);
        }
    }

    public getEditorStatusData():any
    {
        let data:any =
        {
            selectedNote:(this._selectedNote!=null)?this._selectedNote.id:"",
            selectedNotebook:(this._selectedNotebook!=null)?this._selectedNotebook.id:"",
            mode:this._noteListMode
        }
        return data;
    }
}