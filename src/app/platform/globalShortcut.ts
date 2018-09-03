// Node Modules
import {globalShortcut } from "electron";

// Local Modules
import Core           from "core/core"

export default class GlobalShortcuts
{
    public static initialize() : void
    {
        globalShortcut.register("CommandOrControl+R", () =>
        {
           // Application.instance.windowShow()

           //Core.instance.beginQuickSearch();
        }); 

        globalShortcut.register("CommandOrControl+Q", () =>
        {
          //  Application.instance.toggleDevTools();
        });
    }
}
