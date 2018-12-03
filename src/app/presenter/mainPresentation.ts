// Core
import Presentation from "core/presentation";

// Presenter
import Presenter            from "presenter/presenter";
import NavigationPresenter  from "presenter/presenters/nagivationPresenter";
import ApplicationPresenter from "presenter/presenters/applicationPresenter";
import NoteViewPresenter    from "presenter/presenters/noteViewPresenter";
import NoteListPresenter    from "presenter/presenters/noteListPresenter";
import MessageChannel       from "presenter/messageChannel";

import Platform from "core/platform";
import Core     from "core/core";


export default class MainPresentation implements Presentation
{
    private _core:Core;
    private _platform:Platform;

    private _presenters:Array<Presenter>;

    private _applicationPresenter :ApplicationPresenter;
    private _navigationPresenter  :NavigationPresenter;
    private _noteViewPresenter    :NoteViewPresenter;
    private _noteListPresenter    :NoteListPresenter;

    // Update Status
    private _willUpdateNextTick:boolean   = false;
    private _pendingUpdate:number = PendingUpdate.None;

    private _afterUpdateActions: Array<() => void> = [];

    constructor()
    {
        this._presenters = new Array<Presenter>();
    }

    // Dependency Set
    public setApplicationPresenter(presenter:ApplicationPresenter):void 
    {
        this._applicationPresenter = presenter;
    } 
    
    public setNavigationPresenter(presenter:NavigationPresenter):void 
    {
        this._navigationPresenter = presenter;
    } 

    public setNoteViewPresenter(presenter:NoteViewPresenter):void 
    {
        this._noteViewPresenter = presenter;
    } 

    public setNoteListPresenter(presenter:NoteListPresenter):void 
    {
        this._noteListPresenter = presenter;
    } 

    // Presentation functions

    public initialize(core:Core, platform:Platform):void
    {
        this._core     = core;
        this._platform = platform;

        this._presenters.push(this._applicationPresenter);
        this._presenters.push(this._navigationPresenter);
        this._presenters.push(this._noteListPresenter);
        this._presenters.push(this._noteViewPresenter);

        for(let a = 0; a < this._presenters.length; ++a)
        {
            this._presenters[a].initialize(this, core, platform);
        }
    }

    // Update Functions
    public updatePresentation():void
    {
        this.updateNavigationPanel();
        this.updateNoteListPanel();
        this.updateNoteViewPanel();
    }

    public updateNavigationPanel():void
    {
        this._pendingUpdate |= PendingUpdate.NavigationPanel;
        this.tryUpdateNextTick();
    }

    public updateNoteListPanel():void
    {
        this._pendingUpdate |= PendingUpdate.NoteList;
        this.tryUpdateNextTick();
    }

    public updateNoteViewPanel():void
    {
        this._pendingUpdate |= PendingUpdate.NoteView;
        this.tryUpdateNextTick();
    }

    private tryUpdateNextTick():void
    {
        if(!this._willUpdateNextTick)
        {
            process.nextTick(()=>this.onNextTick());
            this._willUpdateNextTick = true;
        }
    }

    public onceNextFrame(f:()=>void):void
    {
        this._afterUpdateActions.unshift(f);
        this.tryUpdateNextTick();
    }

    private onNextTick():void
    {
        if((this._pendingUpdate & PendingUpdate.NavigationPanel) != 0)
        {
            this._navigationPresenter.update();
        }

        if((this._pendingUpdate & PendingUpdate.NoteList) != 0)
        {
            this._noteListPresenter.update();
        }

        if((this._pendingUpdate & PendingUpdate.NoteView) != 0)
        {
            this._noteViewPresenter.update();
        }

        while(this._afterUpdateActions.length > 0)
        {
            var action:()=>void = this._afterUpdateActions.shift();
            action();
        }

        this._willUpdateNextTick = false;
        this._pendingUpdate = PendingUpdate.None;
    }

    public scrollToNote(noteId:string)
    {
        let data =
        {
            noteId: noteId
        }

        this._platform.sendUIMessage(MessageChannel.focusNote, data);
    }

    public scrollToNotebook(notebookId:string)
    {
        let data =
        {
            notebookId: notebookId
        }

        this._platform.sendUIMessage(MessageChannel.focusNotebook, data);
    }

    public scrollToStorage(storageId:string)
    {
        let data =
        {
            storageId: storageId
        }

        this._platform.sendUIMessage(MessageChannel.focusStorage, data);
    }
}