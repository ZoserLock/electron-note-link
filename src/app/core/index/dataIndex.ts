
// Node Modules
import * as Path from "path";
import * as fs from "fs-extra";

// Tools
import Debug     from "tools/debug";

// Core
import Notebook from "core/data/notebook";
import Note from "core/data/note";
import NoteIndexData from "core/index/noteIndexData";


export default class DataIndex
{
    private _basePath:string;

    private _noteList: Array<NoteIndexData>          = new Array<NoteIndexData>();
    private _noteIndex: Dictionary<NoteIndexData>    = {};

    private _dirty            = false;
    private _willSaveNextTick = false;
    private _saving           = false;

    constructor(basePath:string)
    {
        this._basePath = basePath;
        this._dirty    = true;
    }

    public load():void
    {
        let jsonData = null;
        try 
        {
            jsonData = fs.readJsonSync(Path.join(this._basePath, "index.json"));
        }
        catch(e)
        {
            Debug.logError("Load Index Failed: "+e);
            return;
        }

        for(let a = 0;a < jsonData.length; ++a)
        {
            this.addNoteIndexData(jsonData[a]);
        }
    }

    public clearUnusedEntries():void
    {
     /*   for(let a = 0; a < this._noteList.length; ++a)
        {

        }*/
    }

    private requestSave():boolean
    {
        if(this._dirty && !this._saving)
        {
            this.trySaveNextTick();

            return true;
        }
        return false;
    }

    private addNoteIndexData(note:any):void
    {
        let noteData = NoteIndexData.createFromSaveData(note);

        this._noteList.push(noteData);
        this._noteIndex[note._path] = noteData;
    }

    public updateNoteIndexData(note:Note):void
    {
        let noteData:NoteIndexData = this.getNoteIndexData(note.getFullPath());

        if(noteData == null)
        {
            noteData = NoteIndexData.createFromNote(note);
            this._noteList.push(noteData);
            this._noteIndex[note.getFullPath()] = noteData;
            this._dirty = true;
            this.requestSave();
        }
        else
        {
            if(noteData.setNoteData(note))
            {
                this._dirty = true;
                this.requestSave();
            }
        }
    }

    public getNoteIndexData(id:string):NoteIndexData
    {
        if(this._noteIndex[id] != undefined)
        {
            return this._noteIndex[id];
        }
        return null;
    }

    private trySaveNextTick():void
    {
        if(!this._willSaveNextTick)
        {
            this._saving = true;
            this._willSaveNextTick = true;
            process.nextTick(()=>this.onNextTick());
        }
    }       

    private onNextTick():void
    {
        this._dirty = false;
        this._saving = false;

        Debug.log("[Index] Saving Index");

        console.time(" -> [Index] [Benchmark] Save Index Data");
        fs.writeJsonSync(Path.join(this._basePath, "index.json"),this._noteList);
        console.timeEnd(" -> [Index] [Benchmark] Save Index Data");

        this._willSaveNextTick = false;

    }
}