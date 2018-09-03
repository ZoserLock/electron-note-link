// Node.js
import * as React from "react";

import NavigationPanel from "./navigationPanel/navigationPanel"
import NoteList from "./noteList/noteList";
import NoteView from "./noteView/noteView";
import StatusBar from "./statusBar";
import Toolbar from "./toolbar/toolbar";
import WindowBar from "./windowbar/windowbar";
import PopupLayer from "./popupLayer"

export default class ApplicationWindow extends React.Component<any, any> 
{
    // Never update this component as is a layout only component
    public shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any):boolean
    {
        return false;
    }

    public render():React.ReactNode
    {
        return(
            <div className="ui-window">
                <WindowBar/>
                <Toolbar/>
                <div className="ui-main">
                    <NavigationPanel/>
                    <NoteList/>
                    <NoteView/>
                </div>
                <StatusBar/>
                <PopupLayer/>
            </div>
        );
    }
}