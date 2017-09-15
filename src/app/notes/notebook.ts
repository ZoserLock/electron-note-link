import Note from "./note"

export default class Notebook
{

    private _id:string;
    private _path:string;
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

    get notes(): Note[]
    {
        return this._notes;
    }

    // Member Functions
    constructor(id:string,path:string)
    {
        this._notes = new Array<Note>();
        this._id   = id;
        this._path = path;
    }

    public addNote(note:Note)
    {
        this.notes.push(note);
    }

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