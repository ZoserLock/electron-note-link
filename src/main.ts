// Node.js
import { app } from "electron";
import * as uuid from "uuid/v4"

// Tools
import Debug           from "tools/debug";

// Platform
import Application     from "platform/application";

// Core
import Core            from "core/core";

// Presenter
import MainPresentation         from "presenter/mainPresentation";
import NavigationPresenter      from "presenter/presenters/nagivationPresenter";
import NoteListPresenter        from "presenter/presenters/noteListPresenter";
import NoteViewPresenter        from "presenter/presenters/noteViewPresenter";
import ApplicationPresenter     from "presenter/presenters/applicationPresenter";
import PopupPresenter           from "presenter/presenters/popupPresenter";

// Initialize NoteLink
if(process.env.DEBUG)
{
    console.log("Notelink [Development Mode] version: "+process.env.VERSION);
}
else
{
    console.log("Notelink [Production Mode] version: "+process.env.VERSION);
}

Debug.log("Initializing NoteLink");

// Called to avoid slow loading when is used for the fist time
uuid();

// Create dependencies
let platform     = new Application();

let presentation = new MainPresentation([
    new PopupPresenter(),
    new ApplicationPresenter(),
    new NavigationPresenter(),
    new NoteListPresenter(),
    new NoteViewPresenter()
]);

let core = new Core(platform, presentation);

// Launch Application
app.on("ready",() => core.initialize());

