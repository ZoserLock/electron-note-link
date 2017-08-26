export default class Configuration
{
    private static sConfigurationPath:string = "config.json";
    
    private static sInstance:Configuration;
    
    // Singleton functions
    static get instance(): Configuration 
    {
        return this.sInstance;
    }

    static initialize(): void
    {
        this.sInstance = new Configuration();
        this.sInstance.loadConfigurationFile();
    }

    private loadConfigurationFile(): void
    {
        
    }

    private saveConfigurationFile(): void
    {

    }
}