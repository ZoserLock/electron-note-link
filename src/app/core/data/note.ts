// Node Modules
import * as Path from "path";
import * as uuid from "uuid/v4";

// Tools
import Debug from "tools/debug";

// Core
import Notebook from "core/data/notebook";
import NoteIndexData from "../index/noteIndexData";

export default class Note
{
    private _notebook:Notebook;

    private _id:string;
    private _folderPath:string;
    private _fileName:string;
    private _fullPath:string;
    private _title:string;
    private _text:string;

    private _created:number;
    private _updated:number;

    private _selected:boolean;

    private _loaded:boolean;

    private _started:boolean;
    private _trash:boolean;

    //#region Get/Set

    get id(): string
    {
        return this._id;
    }

    get folderPath(): string
    {
        return this._folderPath;
    }

    get fileName(): string
    {
        return this._fileName;
    }

    get fullPath(): string
    {
        return this._fullPath;
    }

    get title(): string
    {
        return this._title;
    }

    get text(): string
    {
        return this._text;
    }

    get updated():number
    {
        return this._updated;
    }

    get created():number
    {
        return this._created;
    }

    get trashed(): boolean
    {
        return this._trash;
    }

    get started(): boolean
    {
        return this._started;
    }

    set started(value:boolean)
    {
        this._started = value;
    }

    // Not saved
    get isSelected(): boolean
    {
        return this._selected;
    }

    get isLoaded(): boolean
    {
        return this._loaded;
    }

    get parent():Notebook
    {
        return this._notebook;
    }
    //#endregion

    // Member functions
    constructor()
    {
        this._id    = "";
        this._title = "Unammed Note";
        this._text  = "";

        this._selected = false;
        this._loaded = false;
    }

    public static createNew(path:string):Note
    {
        let note:Note = new Note();
        note._created = Date.now();
        note._updated = Date.now();
        note._id      = uuid();
        note._folderPath = path;
        note._fileName = note.id + ".json";
        note._fullPath = Path.join(note._folderPath, note._fileName);
        note._loaded = true;
        return note;
    }
    
    public static clone(original:Note):Note
    {
        let note:Note = new Note();
        note._created = Date.now();
        note._updated = Date.now();
        note._id      = uuid()
        note._text    = original.text;
        note._started = original.started;
        note._trash   = original.trashed;
        note._title   = original.title;
        note._folderPath = original.folderPath;
        note._fileName = note.id + ".json";
        note._fullPath = Path.join(note._folderPath, note._fileName);
        note._loaded   = true;
        return note;
    }

    public static createFromIndexData(data:NoteIndexData, path:string):Note
    {
        let note:Note = new Note();
        note._created = data.created;
        note._updated = data.updated;
        note._id = data.id;
        note._title = data.title;
        note._text = "";
        note._trash =data.trashed;
        note._started=data.started;
        note._folderPath = path;
        note._fileName = note.id + ".json";
        note._fullPath = Path.join(note._folderPath, note._fileName);
        note._loaded = false;
        return note;
    }
    public static createFromSavedData(data:any, path:string):Note
    {
        let note:Note = new Note();
        note.setData(data);
        note._folderPath = path;
        note._fileName = note.id + ".json";
        note._fullPath = Path.join(note._folderPath, note._fileName);
        note._loaded = true;
        return note;
    }

    public setData(data:any):void
    {
        this._id      = data.id;
        this._title   = data.title   || "";
        this._text    = data.text    || "";
        this._trash   = data.trashed || false;
        this._started = data.started || false;
        this._created = data.created || Date.now();
        this._updated = data.updated || Date.now();
    }

    public setParent(notebook:Notebook):void
    {
        this._notebook = notebook;
    }

    public setLoaded():void
    {
        this._loaded = true;
    }
    
    public removeFromParent()
    {
        if(this._notebook != null)
        {
            this._notebook.removeNote(this); 
            this._notebook = null;
        }
    }

    public setTrashed(trashed:boolean):void
    {
        this._trash = trashed;
    }

    public SetAsSelected():void
    {
        this._selected = true;
    }

    public SetAsUnselected():void
    {
        this._selected = false;
    }

    public updateDates():void
    {
        this._updated = Date.now();
    }

    public getSaveObject():any
    {
        let saveObject:any = {
            id:this._id, 
            title:this._title,
            text:this._text,
            trashed:this._trash,
            started:this._started,
            created:this._created,
            updated:this._updated
        };

        return saveObject
    }

    public applyUpdateData(updateData:NoteUpdateData):boolean
    {
        let dataUpdated = false;
        if(updateData.title !== undefined)
        {
            this._title = updateData.title;
            dataUpdated = true;
        }

        if(updateData.text !== undefined)
        {
            this._text = updateData.text;
            dataUpdated = true;
        }

        if(updateData.started !== undefined)
        {
            this._started = updateData.started;
            dataUpdated = true;
        }
        
        if(updateData.trash !== undefined)
        {
            this._trash = updateData.trash;
            dataUpdated = true;
        }

        return dataUpdated;
    }

    public changePath(newPath:string):void
    {
        this._folderPath = newPath;
        this._fullPath = Path.join(this._folderPath, this._fileName);
    }
    


}