import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import ToolbarItem from "./toolbarItem"; 
import SearchBar from "./searchBar"; 
import Message from "../../../core/message";

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
        ipcRenderer.addListener(Message.beginQuickSearch,this._beginQuickSearch);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(Message.beginQuickSearch,this._beginQuickSearch);
    }

    public beginQuickSearch(data:any):void
    {
        this._searchBar.focus();
    }

    private createNewNotebookStorage():void
    {
        ipcRenderer.send(Message.createStorage);
    }

    private createNewNote():void
    {
        ipcRenderer.send(Message.createStorage);
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
                <ToolbarItem name="Add Storage" onClick={()=>this.createNewNote()}/>
                <SearchBar ref={(ref) => this._searchBar = ref}/>
                <ToolbarItem name="Test Popup" onClick={()=>this.testPopup()}/>
            </header>
        );
    }

}