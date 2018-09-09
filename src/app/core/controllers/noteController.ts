// Tools
import Debug            from "tools/debug";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

import Note             from "core/data/Note";

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
