import { ipcMain } from 'electron'
// Local Modules
import Action from './action'

export default class ActionManager
{
    private static sInstance:ActionManager;
    
    // Singleton functions
    static get instance(): ActionManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new ActionManager();
    }

    public execute(action:Action):void
    {
        action.execute();
    }
}