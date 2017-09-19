import * as React from "react";
import {ipcRenderer} from "electron"; 

import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 

export default class NoteList extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <div className="ui-note-list">
                <NoteListHeader/>
                <NoteListContent/>
            </div>
        );
    }

}