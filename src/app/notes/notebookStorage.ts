
import * as Path from "path";

import Debug from "../tools/debug";
import Notebook from "./notebook"

export default class NotebookStorage
{
    private static sNotebooksFolderName:string = "notebooks";
    private static sStorageFileName:string     = "notelink.json";

    private _id:string;
    private _name:string;
    private _folderPath:string;
    private _notebooks:Notebook[];

    // Get/Set
    get id(): string
    {
        return this._id;
    }
        
    get name(): string
    {
        return this._name;
    }

    get folderPath(): string
    {
        return this._folderPath;
    }

    get notebooks(): Notebook[]
    {
        return this._notebooks;
    }

    // Member functions

    constructor()
    {
        this._notebooks = new Array<Notebook>();

        this._name = "Unammed Storage";
        this._id   = "";
        this._folderPath = "";
    }
    
    public static create(id:string, path:string):NotebookStorage
    {
        let storage:NotebookStorage = new NotebookStorage();
        storage._id   = id;
        storage._folderPath = path;
        return storage;
    }

    public static createFromSavedData(data:any, path:string):NotebookStorage
    {
        let storage:NotebookStorage = new NotebookStorage();
        storage._id   = data.id;
        storage._name = data.name;
        
        storage._folderPath = path;
        return storage;
    }

    public static createFromData(data:any):NotebookStorage
    {
        let storage:NotebookStorage = new NotebookStorage();
        Object.assign(storage, data);
        return storage;
    }

    public addNotebook(notebook:Notebook):void
    {
        notebook.setParent(this);
        this._notebooks.push(notebook);
    }

    public removeNotebook(notebook:Notebook):void
    {
        for(let a = 0;a < this._notebooks.length ;++a)
        {
            if(this._notebooks[a] == notebook)
            {
                notebook.setParent(null);
                this._notebooks.splice(a,1);
                break;
            }
        }
    }

    public removeAllNoteBooks():void
    {
        this._notebooks = [];
    }
    //////////////////
    // Other Functions

    public getNoteCount():number
    {
        let total:number=0;
        for(var a = 0;a < this._notebooks.length; ++a)
        {
            total += this._notebooks[a].getNoteCount();
        }
        return total;
    }

    public getNotebookCount():number
    {
        return this._notebooks.length;
    }

    public getFullPath():string
    {
        return Path.join(this._folderPath,NotebookStorage.sStorageFileName);
    }

    public getNotebooksFolderPath():string
    {
        return Path.join(this._folderPath,NotebookStorage.sNotebooksFolderName);
    }

    public getSaveObject():any
    {
        let saveObject = {id:this._id, name:this._name};

        return saveObject
 
    }


}