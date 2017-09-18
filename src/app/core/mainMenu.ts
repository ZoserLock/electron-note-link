// Node Modules
import { Menu, MenuItem } from "electron";

// Local Modules
import Application      from "../core/application"
import ActionManager    from "../core/actionManager";
import AddNoteAction    from "../core/actions/addNoteAction";
import Configuration    from "../tools/configuration";

export default class MainMenu
{
    private static _menu: Electron.Menu;
    private static _fileMenu: Electron.MenuItem;

    public static initialize():void
    {
        this._menu = new Menu();

        this.CreateFileMenu();
    
        this._menu.append(this._fileMenu);

        Menu.setApplicationMenu(this._menu);
    }

    private static CreateFileMenu()
    {
        this._fileMenu = new MenuItem(
        {
            label:"File",
            submenu:
            [
                {
                    label:"New Note",
                    accelerator: "CmdOrCtrl+P",
                    click:() =>
                    {
                        let newNoteAction:AddNoteAction = new AddNoteAction("New note");
                        ActionManager.instance.execute(newNoteAction);
                    }
                },
                {
                    type:"separator"
                },
                {
                    label:"Exit",
                    accelerator: "CmdOrCtrl+X",
                    click:() =>
                    {
                        Application.instance.exit();
                    }
                }
            ]
        });
    }
}
