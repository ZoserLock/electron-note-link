
import * as Path from "path";
import * as fs from "fs-extra";

import Debug from "./debug";


export default class FileTools
{
    public static readJsonSync(path:string):any 
    {
        let jsonData = null;
        try 
        {
            jsonData = fs.readJsonSync(path);
        }
        catch(e)
        {
            Debug.logError("Load Storage Failed: "+e);
            return null;
        }
        return jsonData;
    }

    public static readJsonAsync(path:string,callback:any):void 
    {
        fs.readJson(path,callback);
    }

    public static getJsonFilesInFolder(path:string, appendFolderPath:boolean = true):string[]
    {
        try 
        {
            if(!fs.lstatSync(path).isDirectory())
            {
                return null;
            }
        }
        catch(e)
        {
            return null;
        }

        let filePaths:string[] = [];

        try 
        {
            filePaths = fs.readdirSync(path);
        }
        catch(e)
        {
            Debug.logError("Failed to get Json files in folder: "+path );
            return null;
        }

        let jsonPaths:string[] = [];
        // Load Storage Notebooks
        for(let b = 0;b < filePaths.length; ++b)
        {
            let filePath:string = filePaths[b];

            if(Path.extname(filePath) !== ".json") 
            {
                continue;
            }
            else
            {
                if(appendFolderPath)
                {
                    jsonPaths.push(Path.join(path,filePath));
                }
                else
                {
                    jsonPaths.push(filePath);
                }
            }
        }
        return jsonPaths;
    }
    
}
