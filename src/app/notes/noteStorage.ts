import Notenook from "./notebook"

export default class NoteStorage
{
    private _id:string;
    private _path:string;
    private _notebooks:Notenook[];

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