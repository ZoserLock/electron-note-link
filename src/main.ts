// Load Npm Modules
import * as uuid from "uuid/v4"

// Load Local Modules
import Application from "appbase/application"


if(process.env.DEBUG)
{
    console.log("Notelink [Development Mode]");
}
else
{
    console.log("Notelink [Production Mode]");
}


// Called to avoid loading after
uuid();

// Create and initialize Application
Application.initialize();