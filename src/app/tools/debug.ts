export default class Debug
{
    public static log(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(" -> "+text); 
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