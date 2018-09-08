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
    private _beginQuickSearch: (event: any, data: any) => void;
    private _searchBar:ToolbarSearchBar;

    constructor(props: any)
    {
        super(props);
        
        this._beginQuickSearch = (event:any,data:any)=>this.beginQuickSearch(data);
    }

    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.beginQuickSearch,this._beginQuickSearch);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.beginQuickSearch,this._beginQuickSearch);
    }

    public beginQuickSearch(data:any):void
    {
        this._searchBar.focus();
    }

    private createNewNotebookStorage():void
    {
        this.sendMainMessage(MessageChannel.createStorage);
    }

    private createNewNote():void
    {
        this.sendMainMessage(MessageChannel.createStorage);
    }
    
    private testPopup():void
    {
        this.sendMainMessage(MessageChannel.testPopup);
    }

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <ToolbarItem name="Add Storage" onClick={()=>this.createNewNotebookStorage()}/>
                <ToolbarItem name="Add Note" onClick={()=>this.createNewNote()}/>
                <ToolbarSeparator/>
                <ToolbarSearchBar ref={(ref) => this._searchBar = ref}/>
                <ToolbarSeparator/>
                <ToolbarItem name="Test Popup" onClick={()=>this.testPopup()}/>
            </header>
        );
    }

}