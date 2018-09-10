// Node Modules
import * as uuid from "uuid/v4";
import * as Path from "path";
import * as Fuse from "fuse.js";

// Tools
import Debug            from "tools/debug";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

import Note             from "core/data/Note";
import Notebook         from "core/data/notebook";

export default class ApplicationController
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

    public getAllNotes():Note[]
    {
        let notes:Note[] = [];

        notes = this._core.dataManager.notes.filter((note:Note)=>
        {
            return (!note.trashed);
        });
        
        return notes;
    }

    public getTrashNotes():Note[]
    {
        let notes:Note[] = [];

        notes = this._core.dataManager.notes.filter((note:Note)=>
        {
            return (note.trashed);
        });
        
        return notes;
    }

    public getStartedNotes():Note[]
    {
        let notes:Note[] = [];

        notes = this._core.dataManager.notes.filter((note:Note)=>
        {
            return (note.started);
        });
        
        return notes;
    }

    public getCurrentSearchResult():Note[]
    {
        let notes:Note[] = [];

        var options = 
        {
            keys: ['title'],
            threshold: 0.4,
            minMatchCharLength: 3,
        }

        // Process special keyworlds and cache them until the special keywords disapear.
     
        // Cache this list as something like current Searchable notes.
        notes = this._core.dataManager.notes.filter((note:Note)=>
        {
            return (!note.trashed);
        });

        var fuse = new Fuse(notes, options);

        notes = fuse.search(this._core.searchPhrase);

        return notes;
    }

    public getCurrentNotebookNotes():Note[]
    {
        let notes:Note[] = [];

        if(this._core.selectedNotebook != null && this._core.dataManager.notes.length != 0)
        {
            notes = this._core.selectedNotebook.notes.filter((note:Note)=>
            {
                return (!note.trashed);
            });
        }

        return notes;
    }

    public updateSearch(searchPhase:string):void
    {
        let mode:number = this._core.noteListMode;

        if(mode == NoteListMode.Search)
        {
            if(searchPhase == "")
            {
                this._core.cancelSearch(searchPhase);
            }
            else
            {
                this._core.updateSearch(searchPhase);
            }
        }
        else
        {
            if(searchPhase != "")
            {
                this._core.beginSearch(searchPhase);
            }
        }
    }

}
