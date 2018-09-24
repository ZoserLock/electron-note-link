// Node Modules
import * as React from "react";

// UI
import NavigationPanel  from "ui/components/navigationPanel/navigationPanel"
import NoteListPanel    from "ui/components/noteListPanel/noteListPanel";
import NoteView         from "ui/components/noteViewPanel/noteViewPanel";

import WindowBar        from "ui/components/windowbar/windowbar";
import Toolbar          from "ui/components/toolbar/toolbar";
import StatusBar        from "ui/components/statusBar";
import PopupLayer       from "ui/components/popupLayer";
import LoadingLayer     from "ui/components/loadingLayer";

export default class ApplicationWindow extends React.PureComponent<any, any> 
{
    public render():React.ReactNode
    {
        return(
            <div className="ui-window">
                <WindowBar/>
                <Toolbar/>
                <div className="ui-main">
                    <NavigationPanel/>
                    <NoteListPanel/>
                    <NoteView/>
                </div>
                <StatusBar/>
                <PopupLayer/>
                <LoadingLayer/>
            </div>
        );
    }
}