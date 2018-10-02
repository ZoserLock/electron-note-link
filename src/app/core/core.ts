// Tools
import Debug from "tools/debug";

// Core
import DataManager      from "core/dataManager";
import Presentation     from "core/presentation";
import Platform         from "core/platform";
import Notebook         from "core/data/notebook";
import Note             from "core/data/note";

import PopupController          from "core/controllers/popupController";
import StorageController        from "core/controllers/storageController";
import NotebookController       from "core/controllers/notebookController";
import NoteController           from "core/controllers/noteController";
import ApplicationController    from "core/controllers/applicationController";

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
    private _noteController:NoteController;
    private _applicationController:ApplicationController;

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

    get noteController():NoteController
    {
        return this._noteController;
    }

    get applicationController():ApplicationController
    {
        return this._applicationController;
    }

    //#endregion

    // Member Functions
    public constructor(platform:Platform, presentation:Presentation)
    {
        this._platform     = platform;
        this._presentation = presentation;

        this._dataManager        = new DataManager();

        this._popupController       = new PopupController(this,this._platform, this._presentation,this._dataManager);
        this._storageController     = new StorageController(this,this._platform, this._presentation,this._dataManager);
        this._notebookController    = new NotebookController(this,this._platform, this._presentation,this._dataManager);
        this._noteController        = new NoteController(this,this._platform, this._presentation,this._dataManager);
        this._applicationController = new ApplicationController(this,this._platform, this._presentation,this._dataManager);
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

        this._presentation.updatePresentation();
       
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
                    this._dataManager.ensureNoteLoaded(this._selectedNote);
                    this._selectedNote.SetAsSelected();
                }
            }
        }
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
        this._presentation.updateNoteListPanel();
    }

    public cancelSearch(search:string):void
    {
        this._searchPhrase = "";
        this.setNoteListMode(NoteListMode.Notebook);
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

            this._presentation.updateNavigationPanel();
            this._presentation.updateNoteListPanel();

            if(shouldUpdateNoteView)
            {
                this._presentation.updateNoteViewPanel();
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

            this._presentation.updateNavigationPanel();
            this._presentation.updateNoteListPanel();
        }

        this.setNoteListMode(NoteListMode.Notebook);
    }

    public setNoteListMode(mode:number):void
    {
        if(mode != this._noteListMode)
        {
            Debug.log("setNoteListMode: "+mode);
            this._noteListMode = mode;

            this._presentation.updateNavigationPanel();
            this._presentation.updateNoteListPanel();
        }
    }

    public unselectNote():void
    {
        if( this._selectedNote != null)
        {
            this._selectedNote.SetAsUnselected();
            this._selectedNote = null;

            this._presentation.updateNoteListPanel();
            this._presentation.updateNoteViewPanel();
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

            this._presentation.updateNoteListPanel();
            this._presentation.updateNoteViewPanel();

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

    public viewNotebookSource(notebookId:string):void
    {
        let notebook:Notebook = this._dataManager.getNotebook(notebookId);

        if(notebook != null)
        {
            this._platform.showOnExplorer(notebook.getFullPath());
        }
    }

    public viewNoteSource(noteId:string):void
    {
        let note:Note = this._dataManager.getNote(noteId);

        if(note != null)
        {
            this._platform.showOnExplorer(note.fullPath);
        }
    }

    public createNoteLink(noteId:string):void
    {
        let note:Note = this._dataManager.getNote(noteId);

        if(note != null)
        {
            let noteLink:string="[Note Link](#note:"+note.id+")";

            this._platform.setClipboard(noteLink);
        }
    }
}