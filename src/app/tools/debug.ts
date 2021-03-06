export default class Debug
{
    public static log(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(" -> "+text); 
        }
    }

    public static logVar(obj:any)
    {
        if(process.env.DEBUG)
        {
            let json:string = JSON.stringify(obj);
            console.log(" -> "+json); 
        }
    }

    public static logError(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(" -> [ERROR] "+text); 
        }
    }

    public static time(name:string):void
    {
        if(process.env.DEBUG)
        {
            console.time(" -> "+name);
        }
    }

    public static timeEnd(name:string):void
    {
        if(process.env.DEBUG)
        {
            console.timeEnd(" -> "+name);
        }
    }
}