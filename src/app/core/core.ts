// Tools
import Debug from "tools/debug";

// Core
import DataManager      from "core/dataManager";
import Presentation     from "core/presentation";
import Platform         from "core/platform";
import Storage          from "core/data/storage";
import Notebook         from "core/data/notebook";
import Note             from "core/data/note";

import PopupController          from "core/controllers/popupController";
import StorageController        from "core/controllers/storageController";
import NotebookController       from "core/controllers/notebookController";
import NoteController           from "core/controllers/noteController";
import ApplicationController    from "core/controllers/applicationController";

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

    // Editor Status
    private _noteListMode:NoteListMode;

    private _selectedNotebook:Notebook;

    private _selectedNote:Note;

    // Selection History
    private _selectionHistoryBack:Array<string>  = [];
    private _selectionHistoryFront:Array<string> = [];

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

        this._dataManager.onNoteRegistered   = (note:Note)=>{ this.onNoteRegistered(note);}
        this._dataManager.onNoteUnregistered = (note:Note)=>{ this.onNoteUnregistered(note);}

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
                this.selectNote(note.id, true);
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

    public selectNote(noteId:string, updateHistory:boolean):boolean
    {
        if(this._selectedNote != null && this._selectedNote.id == noteId)
        {
            return false;
        }

        if(noteId == "")
        {
            this.unselectNote();
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

            // Update History
            if(updateHistory)
            {
                this._selectionHistoryBack.push(noteId);
                this._selectionHistoryFront = [];
            }

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

    public notifyStorageRemoved(storage:Storage)
    {
        if(this.selectedNotebook != null && this.selectedNotebook.storage == storage)
        {
            Debug.log("Unselect notebook being part of deleted/unliked storage");
            this.unselectNotebook();
        }

        if(this.selectedNote != null && this.selectedNote.parent.storage == storage)
        {
            Debug.log("Unselect note being part of deleted/unliked storage");
            this.removeNoteFromHistory(this.selectedNote);
            this.unselectNote();
        }
    }

    public notifyNotebookRemoved(notebook:Notebook)
    {
        let isSelectedNotebook = (this.selectedNotebook == notebook);
        
        if(this.selectedNotebook!=null && this.selectedNotebook == notebook)
        {
            this.unselectNotebook();
        }

        if(this.selectedNote != null && this.selectedNote.parent == notebook)
        {
            Debug.log("Unselect note being part of deleted Notebook");
            this.removeNoteFromHistory(this.selectedNote);
            this.unselectNote();
        }

        // Select some notebook if non is selected
        if(this.selectedNotebook == null)
        {
            if(this.dataManager.notebooks.length > 0)
            {
                let next:Notebook = this.dataManager.notebooks[0];
                this.selectNotebook(next.id);
            }
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

    // Note history related
    private removeNoteFromHistory(note:Note):void
    {
        Debug.log("removeNoteFromHistory: "+note.id);

        for(let a = 0; a < this._selectionHistoryBack.length; ++a)
        {
            let noteId = this._selectionHistoryBack[a];
            if(noteId == note.id)
            {
                Debug.log("removeNoteFromHistory: Found");
                this._selectionHistoryBack.splice(a, 1);
                a--;
            }
        }

        for(let a = 0; a < this._selectionHistoryFront.length; ++a)
        {
            let noteId = this._selectionHistoryFront[a];
            if(noteId == note.id)
            {
                Debug.log("removeNoteFromHistory: Found");
                this._selectionHistoryFront.splice(a, 1);
                a--;
            }
        }
    }

    public showNextHistoryState():void
    {
        if(this._selectionHistoryFront.length > 0)
        {
            let state = this._selectionHistoryFront.shift(); 
            this.selectNote(state, false);
            this._selectionHistoryBack.push(state);
        }
    }

    public showPrevHistoryState():void
    {
        if(this._selectionHistoryBack.length >= 2)
        {
            let state = this._selectionHistoryBack.pop(); 
            let top = this._selectionHistoryBack[this._selectionHistoryBack.length-1];
            this.selectNote(top, false);
            this._selectionHistoryFront.unshift(state);
        }
    }

    // Events
    private onNoteRegistered(note:Note):void
    {
        // Do Nothing
    }

    private onNoteUnregistered(note:Note):void
    {
        this.removeNoteFromHistory(note);
    }
}