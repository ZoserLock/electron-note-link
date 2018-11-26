// Core
import Note from "core/data/note";

export default class NoteIndexData
{
    public id:string;
    public title:string;

    public started:boolean;
    public trashed:boolean;

    public created:number;
    public updated:number;

    constructor()
    {
   
    }   

    public static createFromNote(note:Note):NoteIndexData
    {
        let noteData = new NoteIndexData();
        noteData.setNoteData(note);
        return noteData;
    }

    public static createFromIndexData(note:any):NoteIndexData
    {
        let noteData= new NoteIndexData();
        noteData.setIndexData(note);
        return noteData;
    }

    private setIndexData(note:any):void
    {
        this.id      = note.id;
        this.title   = note.title;
        this.created = note.created;
        this.updated = note.updated;
        this.started = note.started;
        this.trashed = note.trashed;
    }

    public setNoteData(note:Note):boolean
    {
        let changed:boolean=false;

        if(this.id != note.id)
        {
            this.id = note.id;
            changed = true;
        }

        if(this.title != note.title)
        {
            this.title = note.title;
            changed = true;
        }

        if(this.started != note.started)
        {
            this.started = note.started;
            changed = true;
        }

        if(this.trashed != note.trashed)
        {
            this.trashed = note.trashed;
            changed = true;
        }

        if(this.created != note.created)
        {
            this.created = note.created;
            changed = true;
        }

        if(this.updated != note.updated)
        {
            this.updated = note.updated;
            changed = true;
        }

        return changed;
    }
}