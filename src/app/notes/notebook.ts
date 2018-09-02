import * as Path from "path";

import Debug from "../tools/debug";
import Note from "./note";
import NotebookStorage from "./notebookStorage";

export default class Notebook
{
    private _storage:NotebookStorage;
    private _id:string;
    private _orderIndex:number;
    private _folderPath:string;
    private _name:string;
    private _notes:Note[];

    private _selected:boolean;
    
    //#region Get/Set
    get storage(): NotebookStorage
    {
        return this._storage;
    }

    get id(): string
    {
        return this._id;
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
    //#endregion
  
    // Member Functions
    constructor()
    {
        this._notes = new Array<Note>();
        this._name = "Unammed Notebook";
        this._id   = "";
        this._folderPath = "";
    }

    public static create(id:string, path:string):Notebook
    {
        let notebook:Notebook = new Notebook();
        notebook._id   = id;
        notebook._folderPath = path;
        return notebook;
    }

    public static createFromSavedData(data:any, path:string):Notebook
    {
        let notebook:Notebook = new Notebook();
        notebook._id   = data.id;
        notebook._name = data.name;
        notebook._folderPath = path;
        return notebook;
    }

    public GetDataObject():any
    {
        let notes:any[] = this._notes.map((note:Note) =>
        {
            return note.id;
        });

        let dataObject = {
            id:this._id, 
            name:this._name,
            notes:notes
        };

        return dataObject
    }


    public addNote(note:Note):void
    {
        note.setParent(this);
        this.notes.push(note);
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
    }

    public removeAllNotes():void
    {
        this._notes = [];
    }


    public setParent(storage:NotebookStorage):void
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
        let saveObject = {id:this._id, name:this._name};

        return saveObject
    }


}