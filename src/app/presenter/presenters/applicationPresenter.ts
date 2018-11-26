// Presenter
import Presenter        from "presenter/presenter";
import MessageChannel   from "presenter/messageChannel";

export default class ApplicationPresenter extends Presenter
{
    constructor()
    {
        super();
    }
    
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.windowMinimize    ,(data:any) => this.onWindowMinimize());
        this.registerUIListener(MessageChannel.windowMaximize    ,(data:any) => this.onWindowMaximize());
        this.registerUIListener(MessageChannel.windowClose       ,(data:any) => this.onWindowClose());
        this.registerUIListener(MessageChannel.windowLoaded      ,(data:any) => this.onWindowLoaded());
        this.registerUIListener(MessageChannel.windowMenu        ,(data:any) => this.onWindowMenu());
    }

    // Window command
    public onWindowMinimize():void
    {
        this._platform.minimizeMainWindow();
    }
    
    public onWindowMaximize():void
    {
        this._platform.maximizeMainWindow();
    }
    
    public onWindowClose():void
    {
        this._platform.closeMainWindow();
    }

    public onWindowLoaded():void
    {
        this._platform.windowLoadedEvent();
    }

    public onWindowMenu():void
    {
        this._platform.windowMenuEvent();
    }
}