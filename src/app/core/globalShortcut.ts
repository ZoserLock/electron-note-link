// Node Modules
import {globalShortcut } from "electron";

// Local Modules
import Application      from "../core/application";
import Configuration    from "../tools/configuration";
import Editor           from "./editor"

export default class GlobalShortcuts
{
    public static initialize() : void
    {
        globalShortcut.register("CommandOrControl+R", () =>
        {
            Application.instance.windowShow()

            Editor.instance.beginQuickSearch();
        });
    }
}
