export default class Note
{
  
    private _id:string;
    private _path:string;
    private _title:string;
    private _text:string;

    private _dirty:boolean;

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

    // Member functions
    constructor()
    {

    }

    public isDirty():boolean
    {
        return this._dirty;
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