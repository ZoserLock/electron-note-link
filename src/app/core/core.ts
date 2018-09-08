
// Node Modules
import {ipcMain} from "electron"; 

// Tools
import Debug from "tools/debug";

// Core
import DataManager      from "core/dataManager";
import Presentation     from "core/presentation";
import Platform         from "core/platform";
import Notebook         from "core/data/notebook";
import Note             from "core/data/note";

import PopupController    from "core/controllers/popupController";
import StorageController  from "core/controllers/storageController";
import NotebookController from "core/controllers/notebookController";

// Presenter
import MessageChannel   from "presenter/messageChannel";




export default class Core
{
    // Dependencies
    private _presentation:Presentation;
    private _platform:Platform;
    private _dataManager:DataManager;

    // Controllers
    private _popupController:PopupController;
    private _storageController:StorageController;
    private _notebookController:NotebookController;

    // NoteController
    // NotebookController;

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

    // For the moment. The data manager and the popup manager is supposed to be called only for the core package.
    get dataManager(): DataManager 
    {
        return this._dataManager;
    }

    get popupController(): PopupController 
    {
        return this._popupController;
    }

    get storageController():StorageController
    {
        return this._storageController;
    }

    get notebookController():NotebookController
    {
        return this._notebookController;
    }
    //#endregion

    // Member Functions
    public constructor(platform:Platform, presentation:Presentation)
    {
        this._platform     = platform;
        this._presentation = presentation;

        this._dataManager        = new DataManager();

        this._popupController    = new PopupController(this,this._platform, this._presentation,this._dataManager);
        this._storageController  = new StorageController(this,this._platform, this._presentation,this._dataManager);
        this._notebookController = new NotebookController(this,this._platform, this._presentation,this._dataManager);
        
    }

    public initialize():void
    {
        Debug.log("[Core] Initialize");
      
        this._platform      .initialize(this);
        this._presentation  .initialize(this, this._platform);
    }

    public mainWindowLoaded():void
    {
        Debug.log("[Core] Main Window Loaded");
        this._dataManager.checkStorageIntegrety();

        this.initializeEditorStatus();

        this.updateAllPanels();
       
    }

    public initializeEditorStatus():void
    {
        this._noteListMode = NoteListMode.Notebook; 

        let storages = this._dataManager.noteStorages;
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
        this._presentation.updateNoteViewPanel();
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

        let notebook:Notebook = this._dataManager.getNotebook(notebookId);

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

        let note:Note = this._dataManager.getNote(noteId);

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
        let note:Note = this._dataManager.getNote(noteId);

        if(note != null)
        {
            this.selectNotebook(note.parent.id);
        }
    }
}