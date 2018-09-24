// Node Modules
import * as Path from "path";

// Core
import Note     from "core/data/note";
import Storage  from "core/data/storage";

export default class Notebook
{
    private _storage:Storage;
    private _id:string;
    private _orderIndex:number;
    private _folderPath:string;
    private _name:string;
    private _notes:Note[];

    private _created:number;
    private _updated:number;

    private _selected:boolean;

    private _indexDirty:boolean;
    
    //#region Get/Set
    get storage(): Storage
    {
        return this._storage;
    }

    get id(): string
    {
        return this._id;
    }

    get updated():number
    {
        return this._updated;
    }

    get created():number
    {
        return this._created;
    }

    get orderIndex(): Number
    {
        return this._orderIndex;
    }

    get folderPath(): string
    {
        return this._folderPath;
    }

    get name(): string
    {
        return this._name;
    }

    get notes(): Note[]
    {
        return this._notes;
    }

    get isSelected(): boolean
    {
        return this._selected;
    }

    get isIndexDirty():boolean
    {
        return this._indexDirty;
    }
    //#endregion
  
    // Member Functions
    constructor()
    {
        this._notes = new Array<Note>();
        this._name = "Unammed Notebook";
        this._id   = "";
        this._created = Date.now();
        this._updated = Date.now();
        this._folderPath = "";
        this._indexDirty = true;
    }

    public static create(id:string, path:string):Notebook
    {
        let notebook:Notebook = new Notebook();
        notebook._id      = id;
        notebook._created = Date.now();
        notebook._updated = Date.now();
        notebook._folderPath = path;
        return notebook;
    }

    public static createFromSavedData(data:any, path:string):Notebook
    {
        let notebook:Notebook = new Notebook();
        notebook._id      = data.id;
        notebook._name    = data.name;
        notebook._created = data.created;
        notebook._updated = data.updated;
        notebook._folderPath = path;
        return notebook;
    }

    public addNote(note:Note):void
    {
        this.setUpdated();

        note.setParent(this);
        this.notes.push(note);
        this._indexDirty = true;
    }

    public removeNote(note:Note):void
    {
        for(let a = 0;a < this._notes.length ;++a)
        {
            if(this._notes[a] == note)
            {
                note.setParent(null);
                this._notes.splice(a,1);
                break;
            }
        }
        this._indexDirty = true;
    }

    public removeAllNotes():void
    {
        this._notes = [];
        this._indexDirty = true;
    }


    public setParent(storage:Storage):void
    {
        this._storage = storage;
    }

    public removeFromParent()
    {
        if(this._storage != null)
        {
            this._storage.removeNotebook(this); 
            this._storage = null;
        }
    }

    public SetAsSelected():void
    {
        this._selected = true;
    }

    public SetAsUnselected():void
    {
        this._selected = false;
    }

    public getNoteCount():number
    {
        return this._notes.length;
    }

    public setName(name:string):void
    {
        this._name = name;
    }

    public setIndexSaved():void
    {
        this._indexDirty = false;
    }

    private setUpdated():void
    {
        this._updated = Date.now();
    }
    // Save Stuff
    
    public getFullPath():string
    {
        return Path.join(this._folderPath,this.id+".json");
    }

    public getNotesFolderPath():string
    {
        return Path.join(this._folderPath,this._id);
    }

    public getSaveObject():any
    {
        let saveObject = {
            id:this._id,
            name:this._name,
            created:this._created,
            updated:this._updated,
        };

        return saveObject
    }

    public applyUpdateData(updateData:NotebookUpdateData):boolean
    {
        let dataUpdated = false;
        if(updateData.name)
        {
            this._name = updateData.name;
            dataUpdated = true;
        }

        if(dataUpdated)
        {
            this.setUpdated();
        }

        return dataUpdated;
    }


}