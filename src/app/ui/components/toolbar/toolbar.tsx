import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import ToolbarItem from "./toolbarItem"; 
import SearchBar from "./searchBar"; 
import MessageChannel from "presenter/messageChannel";
import ToolbarSeparator from "./toolbarSeparator";

export default class Toolbar extends React.Component<any, any> 
{
    private _beginQuickSearch: (event: any, data: any) => void;
    private _searchBar:SearchBar;

    constructor(props: any)
    {
        super(props);
        
        this._beginQuickSearch = (event:any,data:any)=>this.beginQuickSearch(data);
    }

    public componentDidMount() 
    {
        ipcRenderer.addListener(MessageChannel.beginQuickSearch,this._beginQuickSearch);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(MessageChannel.beginQuickSearch,this._beginQuickSearch);
    }

    public beginQuickSearch(data:any):void
    {
        this._searchBar.focus();
    }

    private createNewNotebookStorage():void
    {
        ipcRenderer.send(MessageChannel.createStorage);
    }

    private createNewNote():void
    {
        ipcRenderer.send(MessageChannel.createStorage);
    }
    
    private testPopup():void
    {
        ipcRenderer.send("action:TestPopup");
    }

    private reloadCss():void 
    {
        ipcRenderer.send("action:ReloadCss");
 
    }

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <ToolbarItem name="Add Storage" onClick={()=>this.createNewNotebookStorage()}/>
                <ToolbarItem name="Add Note" onClick={()=>this.createNewNote()}/>
                <ToolbarSeparator/>
                <SearchBar ref={(ref) => this._searchBar = ref}/>
                <ToolbarSeparator/>
                <ToolbarItem name="Test Popup" onClick={()=>this.testPopup()}/>
            </header>
        );
    }

}