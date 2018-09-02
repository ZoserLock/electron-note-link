// Node Modules
import {globalShortcut } from "electron";

// Local Modules
import Application      from "appbase/application";
import Editor           from "core/editor"

export default class GlobalShortcuts
{
    public static initialize() : void
    {
        globalShortcut.register("CommandOrControl+R", () =>
        {
            Application.instance.windowShow()

            Editor.instance.beginQuickSearch();
        }); 

        globalShortcut.register("CommandOrControl+Q", () =>
        {
            Application.instance.toggleDevTools();
        });
    }
}
