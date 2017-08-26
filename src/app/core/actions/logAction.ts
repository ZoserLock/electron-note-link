// Local Modules
import Action from '../action'
import Debug from '../../tools/debug'

export default class LogAction extends Action
{
    public _text:string;

    constructor(text:string)
    {
        super("Log");
        this._text = text;
    }

    public execute():void
    {
        Debug.log("Log: " + this._text);
    }
}