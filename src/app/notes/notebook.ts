
import Debug from "../tools/debug";
import Note from "./note";

export default class Notebook
{
    private _id:string;
    private _folderPath:string;
    private _name:string;
    private _notes:Note[];

    // Get/set
    get id(): string
    {
        return this._id;
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

    public static createFromData(data:any):Notebook
    {
        let notebook:Notebook = new Notebook();
        Object.assign(notebook, data);
        return notebook;
    }
    
    public addNote(note:Note):void
    {
        this.notes.push(note);
    }

    // Save Stuff
    public getSaveObject():any
    {
        let saveObject = {id:this._id, name:this._name};

        return saveObject
    }
}