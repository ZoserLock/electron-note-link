// Load Npm Modules
import { app, BrowserWindow } from "electron"

// Local Modules
import Action from "../action"
import Debug from "../../tools/debug"

export default class AddNoteAction extends Action
{
    public text:string;

    constructor(text:string)
    {
        super("Add Note");
        this.text = text;
    }

    public execute():void
    {
        Debug.log("Log: " + this.text);
    }
}