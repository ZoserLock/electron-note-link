import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent      from "ui/components/generic/uiComponent";
import ToolbarItem      from "ui/components/toolbar/toolbarItem"
import ToolbarIcon      from "ui/components/toolbar/toolbarIcon"
import ToolbarSearchBar from "ui/components/toolbar/toolbarSearch"; 
import ToolbarSeparator from "ui/components/toolbar/toolbarSeparator";

export default class Toolbar extends UIComponent<any, any> 
{
    private _beginSearchEvent: (event: any, data: any) => void;
    private _searchBar:ToolbarSearchBar;

    constructor(props: any)
    {
        super(props);
        
        this._beginSearchEvent = (event:any,data:any) => this.beginSearchRequested(data);
    }

    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.searchBegin,this._beginSearchEvent);
        this.registerMainListener(MessageChannel.focusSearchBar,this._beginSearchEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.searchBegin,this._beginSearchEvent);
        this.unregisterMainListener(MessageChannel.focusSearchBar,this._beginSearchEvent);
    }

    public beginSearchRequested(data:any):void
    {
        this._searchBar.focus();
    }

    //#region Handle UI Events
    private handleCreateNewStorage():void
    {
        this.sendMainMessage(MessageChannel.createStorage);
    }

    private handleCreateNewNote():void
    {
        this.sendMainMessage(MessageChannel.createNote);
    }

    private handlePrevState():void
    {
        this.sendMainMessage(MessageChannel.showPrevState);
    }

    private handleNextState():void
    {
        this.sendMainMessage(MessageChannel.showNextState);
    }

    private testPopup():void
    {
        this.sendMainMessage(MessageChannel.testPopup);
    }


    //#endregion

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <ToolbarIcon icon="chevron_left" onClick={()=>this.handlePrevState()}/>
                <ToolbarIcon icon="chevron_right" onClick={()=>this.handleNextState()}/>
                <ToolbarSeparator/>
                <ToolbarItem name="Add Storage" onClick={()=>this.handleCreateNewStorage()}/>
                <ToolbarItem name="New Note" onClick={()=>this.handleCreateNewNote()}/>
                <ToolbarSeparator/>
                <ToolbarSearchBar ref={(ref) => this._searchBar = ref}/>
            </header>
        );
    }

}