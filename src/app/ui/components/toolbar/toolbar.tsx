import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent      from "ui/components/generic/uiComponent";
import ToolbarItem      from "ui/components/toolbar/toolbarItem"
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
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.searchBegin,this._beginSearchEvent);
    }

    public beginSearchRequested(data:any):void
    {
        this._searchBar.focus();
    }

    //#region Handle UI Events
    private HandleCreateNewStorage():void
    {
        this.sendMainMessage(MessageChannel.createStorage);
    }

    private handleCreateNewNote():void
    {
        this.sendMainMessage(MessageChannel.createStorage);
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
                <ToolbarItem name="Add Storage" onClick={()=>this.HandleCreateNewStorage()}/>
                <ToolbarItem name="Add Note" onClick={()=>this.handleCreateNewNote()}/>
                <ToolbarSeparator/>
                <ToolbarSearchBar ref={(ref) => this._searchBar = ref}/>
                <ToolbarSeparator/>
                <ToolbarItem name="Test Popup" onClick={()=>this.testPopup()}/>
            </header>
        );
    }

}