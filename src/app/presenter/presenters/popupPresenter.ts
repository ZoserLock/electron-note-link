// Node.js

import * as uuid    from "uuid/v4";
import * as Path    from "path";

// Tools
import Debug        from "tools/debug";

// Presenter
import Presenter    from "presenter/presenter";
import Message      from "presenter/messageChannel"

// Core
import DataManager  from "core/dataManager";
import Core         from "core/core";
import Storage      from "core/data/storage";
import Notebook     from "core/data/notebook";

import PopupManager from "core/controllers/popupController";

export default class PopupPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
       // Overridable
    }
}