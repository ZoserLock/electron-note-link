// Node.js

import * as uuid    from "uuid/v4";
import * as Path    from "path";

// Tools
import Debug        from "tools/debug";

// Presenter
import Presenter    from "presenter/presenter";
import Message      from "presenter/messageChannel"

export default class PopupPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
       // Overridable
    }
}