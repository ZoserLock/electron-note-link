
import Notebook from "./notebook"

export default class NotebookStorage
{
    private _id:string;
    private _name:string;
    private _path:string;
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

    get path(): string
    {
        return this._path;
    }

    get notebooks(): Notebook[]
    {
        return this._notebooks;
    }

    // Member functions

    constructor()
    {
        this._notebooks = new Array<Notebook>();

        this._id   = "";
        this._path = "";
    }
    
    public static create(id:string, path:string):NotebookStorage
    {
        let storage:NotebookStorage = new NotebookStorage();
        storage._id   = id;
        storage._path = path;
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
        return this._path + "/notelink.json";
    }

    public getSaveObject():any
    {
        let notebookIds:any[] = [];
        
        for(let a = 0;a < this._notebooks.length; ++a)
        {
            notebookIds.push(this._notebooks[a].id);
        }
        
        let saveObject = {id:this._id,  path:this._path ,notebooks:notebookIds};

        return saveObject
    }
}