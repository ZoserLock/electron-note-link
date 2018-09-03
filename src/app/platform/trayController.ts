import { Tray, Menu } from "electron";

export default class TrayController
{
    private _trayIcon:Tray;
    
    private _onShowCallback:()=>void;
    private _onExitCallback:()=>void;

    constructor(onShow:()=>void, onExit:()=>void)
    {
        this._onShowCallback = onShow;
        this._onExitCallback = onExit;
    }

    public initialize()
    {
        this._trayIcon = new Tray(__dirname + "/img/tray.ico");
 
        var contextMenu = Menu.buildFromTemplate([
            {
                label: "Show NoteLink", click: () => 
                {
                    this._onShowCallback();
                }
            },
            {
                label: "Exit", click: () => 
                {
                    this._onExitCallback();
                }
            }
        ])
        this._trayIcon.setContextMenu(contextMenu);
        this._trayIcon.setHighlightMode("always");

        this._trayIcon.on("click", () => 
        {
            this._onShowCallback();
        });
    }

}