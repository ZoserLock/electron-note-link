// Node
import * as uuid from "uuid/v4";
import * as Path from "path";
import * as Fuse from "fuse.js";

// Core
import MessageChannel from "presenter/messageChannel"

// Notes
import Note from "core/data/note";

// Presenter
import Presenter        from "presenter/presenter";
import NoteDataParser   from "presenter/parsers/noteDataParser";
import CoreStatusParser from "presenter/parsers/coreStatusParser";

export default class NoteListPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.updateNoteListPanel , (data:any) => this.update());
        
        this.registerUIListener(MessageChannel.createNote          , (data:any) => this.actionNewNote(data));
        this.registerUIListener(MessageChannel.selectNote          , (data:any) => this.actionSelectNote(data));
        this.registerUIListener(MessageChannel.deleteNote          , (data:any) => this.actionDeleteNote(data));

        this.registerUIListener(MessageChannel.duplicateNote       , (data:any) => this.actionDuplicateNote(data));
        this.registerUIListener(MessageChannel.viewNoteSource      , (data:any) => this.actionViewNoteSource(data));
        this.registerUIListener(MessageChannel.createNoteLink      , (data:any) => this.actionCreateNoteLink(data));
        this.registerUIListener(MessageChannel.renameNote          , (data:any) => this.actionRenameNote(data));

        this.registerUIListener(MessageChannel.searchUpdated       , (data:any) => this.actionSearchUpdated(data));
    }

    public onUpdateRequested():void
    {
        let editorMode:number = this._core.noteListMode;
        let notes:Note[] = [];
        let validFilter:boolean = true;
    
        let options:any = {};

        // Get selected note list.
        if(editorMode == NoteListMode.Search)
        {
            notes = this._core.applicationController.getCurrentSearchResult();
            
            options = {
                title:"Search results for: "+this._core.searchPhrase,
            } 
        }
        else if(editorMode == NoteListMode.All)
        {
            notes = this._core.applicationController.getAllNotes();

            options = {
                title:"All Notes"
            } 
        }
        else if(editorMode == NoteListMode.Trash)
        {
            notes = this._core.applicationController.getTrashNotes();

            options = {
                title:"Trash"
            } 
        }
        else if(editorMode == NoteListMode.Started)
        {
            notes = this._core.applicationController.getStartedNotes();

            options = {
                title:"Started Notes"
            } 
        }
        else if(editorMode == NoteListMode.Notebook)
        {
            if(this._core.selectedNotebook != null)
            {
                notes = this._core.applicationController.getCurrentNotebookNotes();

                options = {
                    title:this._core.selectedNotebook.name
                } 
            }
            else
            {
                validFilter = false;
            }
        }

        let noteData:ViewNoteItemData[] = NoteDataParser.createNoteListData(notes);

        let forceUpdate:boolean = true;

        let data =
        {
            options: options,
            notes: noteData,
            status: CoreStatusParser.createCoreStatus(this._core),
            validFilter: validFilter,
            forceUpdate:(forceUpdate)?Math.random():0
        }
        
        this._platform.sendUIMessage(MessageChannel.updateNoteListPanel, data);
    }

    private actionSearchUpdated(data:any):void
    {
        // TODO Sanitize data
        this._core.applicationController.updateSearch(data);
    }

    private actionNewNote(data:any):void
    {
        if(data.notebookId == undefined)
        {
            this._core.noteController.createNewNote(this._core.selectedNotebook.id);
        }
        else
        {
            this._core.noteController.createNewNote(data.notebookId);
        }
    }

    private actionDeleteNote(data:any):void
    {
        // TODO Sanitize data
        this._core.noteController.deleteNote(data.noteId);
    }

    private actionDuplicateNote(data:any):void
    {
        // TODO Sanitize data
        this._core.noteController.duplicateNote(data.noteId);
    }

    private actionViewNoteSource(data:any):void
    {
        this._core.viewNoteSource(data.noteId);
    }

    private actionCreateNoteLink(data:any):void
    {
        this._core.createNoteLink(data.noteId);
    }

    private actionRenameNote(data:any):void
    {
        this._core.noteController.renameNote(data.noteId);
    }

    private actionSelectNote(data:any):void
    {
         // TODO Sanitize data
        this._core.selectNote(data.noteId);
    }
}