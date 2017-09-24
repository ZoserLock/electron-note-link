export default class Note
{
  
    private _id:string;
    private _folderPath:string;
    private _title:string;
    private _text:string;

    private _selected:boolean;

    private _dirty:boolean;
    private _loaded:boolean;

    // Get/Set
    
    get id(): string
    {
        return this._id;
    }

    get folderPath(): string
    {
        return this._folderPath;
    }

    get title(): string
    {
        return this._title;
    }

    get text(): string
    {
        return this._text;
    }

    get isSelected(): boolean
    {
        return this._selected;
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
        this._id    = "";
        this._title = "Unammed Note";
        this._text  = "";

        this._selected = false;
        this._loaded = false;
        this._dirty  = false;
    }

    public static create(id:string, path:string):Note
    {
        let note:Note = new Note();
        note._id   = id;
        note._folderPath = path;
        return note;
    }

    public static createFromSavedData(data:any, path:string):Note
    {
        let note:Note = new Note();
        note._id = data.id;
        note._title = data.title;
        note._text = data.text;
        note._folderPath = path;
        return note;
    }

    public static createFromData(data:any):Note
    {
        let note:Note = new Note();
        Object.assign(note, data);
        return note;
    }

    public setDirty():void
    {
        this._dirty = true;
    }

    public clearDirty():void
    {
        this._dirty = false;
    }

    public SetAsSelected():void
    {
        this._selected = true;
    }

    public SetAsUnselected():void
    {
        this._selected = false;
    }

    public getSaveObject():any
    {
        let saveObject = {id:this._id, title:this._title, text:this._text};

        return saveObject
    }
}