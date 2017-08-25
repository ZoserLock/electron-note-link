export default class Debug
{
    public static log(text:string)
    {
        if(process.env.DEBUG)
        {
            console.log(text); 
        }
    }
}