// Node Modules
import * as uuid from "uuid/v4";
import * as Path from "path";

// Tools
import Debug            from "tools/debug";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

import Note             from "core/data/Note";
import Notebook         from "core/data/notebook";

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

    public createNewNote():void
    {
        let selectedNotebook:Notebook = this._core.selectedNotebook;

        if(selectedNotebook != null)
        {
            let note:Note = Note.create(uuid(), Path.join(selectedNotebook.folderPath,selectedNotebook.id));
            
            if(this._dataManager.addNote(note))
            {
                this._dataManager.saveNote(note);
                selectedNotebook.addNote(note);

                this._core.selectNote(note.id);

                this._presentation.updateNoteListPanel();
            }
        }
        else
        {
            Debug.logError("[Note Controller] Trying to create a note without a notebook selected.");
        }
    }
    
    public deleteNote(id:string):void
    {
        let note:Note = this._core.dataManager.getNote(id);

        if(note != null)
        {
            if(this._core.selectedNote == note)
            {
                this._core.unselectNotebook();
            }

            if(note.trashed)
            {
                this._dataManager.deleteNote(note);
            }
            else
            {
                note.setTrashed(true);
                this._dataManager.saveNote(note);
            }
            
            this._presentation.updateNoteListPanel();
            this._presentation.updateNoteViewPanel();
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
}