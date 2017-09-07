import Notebook from "./notebook"

export default class NotebookStorage
{
    private _id:string;
    private _path:string;
    private _notebooks:Notebook[];

    // Get/Set
        
    get id(): string
    {
        return this._id;
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

    constructor(id:string,path:string)
    {
        this._id   = id;
        this._path = path;
    }

    public GetName():string
    {
        return this._id;
    }
}