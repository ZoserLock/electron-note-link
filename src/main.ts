// Load Npm Modules
import * as uuid from "uuid/v4"

// Load Local Modules
import Application from "./app/core/application"

// Load Enviromental Variables
require("./env")

// Called to avoid loading after
uuid();

// Create and initialize Application
Application.initialize();