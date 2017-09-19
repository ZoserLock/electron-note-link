
import * as Path from "path";

import Debug from "../tools/debug";
import Notebook from "./notebook"

export default class NotebookStorage
{
    private sNotebooksFolderName:string = "notebooks";
    private sNotelinkStorageName:string = "notelink.json";

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
        this._notebooks.push(notebook);
    }

    public getFullPath():string
    {
        return Path.join(this._folderPath,this.sNotelinkStorageName);
    }

    public getNotebooksFolderPath():string
    {
        return Path.join(this._folderPath,this.sNotebooksFolderName);
    }

    public getSaveObject():any
    {
        let saveObject = {id:this._id, name:this._name};

        return saveObject
 
    }
}