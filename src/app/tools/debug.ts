import * as colors from "colors/safe";

export default class Debug
{
    public static log(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(colors.green(" -> "+text)); 
        }
    }

    public static logError(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(" -> [ERROR] "+text); 
        }
    }
}