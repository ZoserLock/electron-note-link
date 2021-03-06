// Node Modules
import * as Path from "path";

// Tools
import Debug            from "tools/debug";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

import Note             from "core/data/note";
import Notebook         from "core/data/notebook";
import NavigationNotebookItem from "ui/components/navigationPanel/navigationNotebookItem";

export default class NoteController
{
    // Dependencies
    private _core:Core;
    private _platform:Platform;
    private _presentation:Presentation;
    private _dataManager:DataManager;

    // State?

    constructor(core:Core, platform:Platform, presentation:Presentation, dataManager:DataManager)
    {
        this._core         = core;
        this._presentation = presentation;
        this._platform     = platform;
        this._dataManager  = dataManager;
    }

    public createNewNote(parentId:string):void
    {
        let notebook:Notebook = this._dataManager.getNotebook(parentId);

        if(notebook != null)
        {
            let note:Note = Note.createNew(notebook.getNotesFolderPath());
            
            if(this._dataManager.addNote(note))
            {
                this._dataManager.saveNote(note);
                notebook.addNote(note);
                this._dataManager.saveNotebook(notebook);

                this._core.selectNote(note.id, true);

                this._presentation.updateNoteListPanel();

                this._presentation.onceNextFrame(()=>
                {
                    this._presentation.scrollToNote(note.id);
                });
            }
        }
        else
        {
            Debug.logError("[Note Controller] Trying to create a note in an invalid notebook");
        }
    }

    public duplicateNote(id:string):void
    {
        let original:Note = this._core.dataManager.getNote(id);
        let notebook:Notebook = original.parent;

        if(original != null && notebook != null)
        {
            let duplicated:Note = Note.clone(original);

            if(this._dataManager.addNote(duplicated))
            {
                this._dataManager.saveNote(duplicated);
                notebook.addNote(duplicated);
                this._dataManager.saveNotebook(notebook);

                this._core.selectNote(duplicated.id, true);

                this._presentation.updateNoteListPanel();

                this._presentation.onceNextFrame(()=>
                {
                    this._presentation.scrollToNote(duplicated.id);
                });
            }
        }    
        else
        {
            Debug.logError("[Note Controller] Duplicate Note: Note or Note Notebook Does not exist");
        }
    }
    
    public deleteNote(id:string):void
    {
        let note:Note = this._core.dataManager.getNote(id);

        if(note != null)
        {
            if(note.trashed)
            {
                this._core.popupController.showConfirmationPanel("Delete Note?","", "Are you sure you want to delete this Note. This operation cannot be undone.","Yes","Cancel",(data:any)=>
                {
                    this._dataManager.deleteNote(note);

                    if(this._core.selectedNote == note)
                    {
                        this._core.unselectNote();
                    }

                    this._presentation.updateNoteListPanel();
                    this._presentation.updateNoteViewPanel();
    
                },null);
            }
            else
            {
                this._core.popupController.showConfirmationPanel("Send to Trash?","", "Are you sure you want to send this Note to Trash.","Yes","Cancel",(data:any)=>
                {
                    note.setTrashed(true);
                    this._dataManager.saveNote(note);

                    if(this._core.selectedNote == note)
                    {
                        this._core.unselectNote();
                    }

                    this._presentation.updateNoteListPanel();
                    this._presentation.updateNoteViewPanel();
    
                },null);
            }
        }
    }
    
    public restoreNote(id:string):void
    {
        let note:Note = this._core.dataManager.getNote(id);

        if(note != null)
        {
            if(note.trashed)
            {
                note.setTrashed(false);
                this._dataManager.saveNote(note);
                
                this._presentation.updateNoteListPanel();
                this._presentation.updateNoteViewPanel();
            }
        }
    }

    public updateNote(noteUpdate:NoteUpdateData):boolean
    {
        let note:Note = this._dataManager.getNote(noteUpdate.id);

        if(note != null)
        {
            if(note.applyUpdateData(noteUpdate))
            {
                this._dataManager.saveNote(note);

                this._presentation.updateNoteListPanel();
    
                if(note == this._core.selectedNote)
                {
                    this._presentation.updateNoteViewPanel();
                }

                return true;
            }
        }
        else
        {
            Debug.logError("[Note Controller] Update Note: Note does not exist.");
        }
        return false;
    }

    public renameNote(id:string):void
    {
        let note:Note = this._core.dataManager.getNote(id);

        if(note != null)
        {
            this._core.popupController.showInputPanel("Note Rename","Type a new title", note.title,"Rename","Cancel",(data:any)=>
            {
                let updateData:NoteUpdateData = {
                    id:note.id,
                    title:data.text
                }

                this.updateNote(updateData);
                
            },null);
        }
    }
}
