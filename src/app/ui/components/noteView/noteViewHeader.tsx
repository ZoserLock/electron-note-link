// Global
import * as React from "react";

// Local
import Debug from "../../../tools/debug";

export default class NoteViewHeader extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddNoteClick()
    {
       // UIManager.instance.sendMessage("action:NewNote");
    }

    public render() 
    {
        return (
            <div className="ui-note-view-header"> 
                Note View Header
            </div>

        );
    }

}