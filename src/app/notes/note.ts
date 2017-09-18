export default class Note
{
  
    private _id:string;
    private _path:string;
    private _title:string;
    private _text:string;

    private _dirty:boolean;
    private _loaded:boolean;

    // Get/Set
    
    get id(): string
    {
        return this._id;
    }

    get path(): string
    {
        return this._path;
    }

    get title(): string
    {
        return this._title;
    }

    get text(): string
    {
        return this._text;
    }

    get loaded(): boolean
    {
        return this._loaded;
    }

    get isDirty(): boolean
    {
        return this._dirty;
    }

    // Member functions
    constructor()
    {
        this._id     = "";
        this._title = "Unammed Note";

        this._loaded = false;
        this._dirty  = false;
    }

    public setDirty():void
    {
        this._dirty = true;
    }

    public clearDirty():void
    {
        this._dirty = false;
    }

    public getSaveObject():any
    {
        let saveObject = {id:this._id,  path:this._path, title:this._title,text:this._text};

        return saveObject
    }
}