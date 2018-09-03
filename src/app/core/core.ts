
import {ipcMain} from "electron"; 
import * as process from "process";

import Debug from "../tools/debug";
import DataManager from "./dataManager";
import Notebook from "../core/data/notebook";
import Note from "../core/data/note";
import MessageChannel from "presenter/messageChannel";

import Presentation from "core/presentation";
import Platform     from "core/platform";

export default class Core
{
    // Dependencies
    private _presentation:Presentation;
    private _platform:Platform;

    // Editor Status
    private _noteListMode:NoteListMode;

    private _selectedNotebook:Notebook;

    private _selectedNote:Note;

    // Search Data
    private _searchPhrase = "";

    //#region Get/Set
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
    //#endregion

    // Member Functions
    public constructor(platform:Platform, presentation:Presentation)
    {
        this._platform     = platform;
        this._presentation = presentation;
    }

    public initialize():void
    {
        Debug.log("[Core] Initialize");
        DataManager.initialize();

        this._platform      .initialize(this);
        this._presentation  .initialize(this, this._platform);
    }

    public mainWindowLoaded():void
    {
        Debug.log("[Core] Main Window Loaded");
        DataManager.instance.checkStorageIntegrety();

        this.initializeEditorStatus();

        this.updateAllPanels();
       
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
        ipcMain.emit(MessageChannel.beginQuickSearch);
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

    ////////////////////
    // Update Actions //
    ////////////////////
    
    public updateAllPanels():void
    {
        this.updateNavigationPanel();
        this.updateNoteList();
        this.updateNoteView();
    }

    public updateNavigationPanel():void
    {
        this._presentation.updateNavigationPanel();
    }

    public updateNoteList():void
    {
        this._presentation.updateNoteListPanel();
    }

    public updateNoteView():void
    {
        this._presentation.UpdateNoteViewPanel();
    }

    /////////////
    // Actions //
    /////////////

    public unselectNotebook():void
    {
        if( this._selectedNotebook!=null)
        {
            let shouldUpdateNoteView:boolean = (this._selectedNote.parent == this._selectedNotebook);
            
            this._selectedNotebook.SetAsUnselected();
            this._selectedNotebook = null;

            this.updateNavigationPanel();
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

            this.updateNavigationPanel();
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

            this.updateNavigationPanel();
            this.updateNoteList();
        }
    }

    public unselectNote():void
    {
        if( this._selectedNote != null)
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