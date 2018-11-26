// Node Modules
import { Menu, MenuItem } from "electron";

export default class MainMenu
{
    private _menu: Electron.Menu;
    private _fileMenu: Electron.MenuItem; 

    public onHandleMenuClick:(command:string)=>void;

    constructor()
    {
        this._menu = Menu.buildFromTemplate
        ([
            {
                label:"New Note",
                accelerator: "CmdOrCtrl+P",
                click:() => 
                {
                    this.onMenuClick("New Note");
                }
            },
            {
                type:"separator"
            },
            {
                label:"Close",
                click:() =>
                {
                    this.onMenuClick("Exit");
                },
            },
            {
                label:"Exit",
                click:() =>
                {
                    this.onMenuClick("Exit");
                }
            }
        ]);
    }

    private onMenuClick(name:string)
    {
        this.onHandleMenuClick(name);
    }

    public show():void
    {
        this._menu.popup({});
    }
} 
