import Note from "core/data/note";
import Debug from "tools/debug";

export default class NoteIndexData
{
    private _id:string;
    private _path:string;
    private _title:string;

    //#region Get/Set
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

    //#endregion

    constructor()
    {
   
    }   

    public static createFromNote(note:Note):NoteIndexData
    {
        let noteData= new NoteIndexData();
        noteData.setNoteData(note);
        return noteData;
    }

    public static createFromSaveData(note:any):NoteIndexData
    {
        let noteData= new NoteIndexData();
        noteData.setSaveData(note);
        return noteData;
    }

    private setSaveData(note:any):void
    {
        this._id    = note._id;
        this._path  = note._path;
        this._title = note._title;
    }

    public setNoteData(note:Note):boolean
    {
        let changed:boolean=false;

        if(this._id != note.id)
        {
            this._id = note.id;
            changed = true;
        }

        if(this._path != note.getFullPath())
        {
            this._path = note.getFullPath();
            changed = true;
        }

        if(this._title != note.title)
        {
            this._title = note.title;
            changed = true;
        }

        return changed;
    }
}