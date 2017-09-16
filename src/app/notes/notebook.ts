import Note from "./note"

export default class Notebook
{

    private _id:string;
    private _path:string;
    private _name:string;
    private _notes:Note[];

    // Get/set
    get id(): string
    {
        return this._id;
    }

    get path(): string
    {
        return this._path;
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
        this._id   = "";
        this._path = "";
    }

    public static create(id:string, path:string):Notebook
    {
        let notebook:Notebook = new Notebook();
        notebook._id   = id;
        notebook._path = path;
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
        let noteIds:any[] = [];

        for(let a = 0;a < this._notes.length; ++a)
        {
            noteIds.push(this._notes[a].id);
        }

        let saveObject = {id:this._id,  path:this._path, notes:noteIds};

        return saveObject
    }
}