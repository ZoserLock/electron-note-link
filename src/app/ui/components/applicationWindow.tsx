import * as React from "react";

import Debug from "../../tools/debug"

import LeftPanel from "./leftPanel";
import NoteList from "./noteList";
import NoteView from "./noteView";
import StatusBar from "./statusBar";
import Toolbar from "./toolbar";
import WindowBar from "./windowBar";

export default class ApplicationWindow extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state = 
        {
            toolbar:null,
        };
    }

    render() 
    {
        Debug.log("Render Application window");
        return(
            <div className="ui-window">
                <WindowBar/>
                <Toolbar/>
                <div className="ui-main">
                    <LeftPanel/>
                    <NoteList/>
                    <NoteView/>
                </div>
                <StatusBar/>
            </div>
        );
    }
}