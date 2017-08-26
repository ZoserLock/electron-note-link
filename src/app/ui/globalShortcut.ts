// Node Modules
import {globalShortcut } from 'electron';

// Local Modules
import ActionManager    from '../core/actionManager';
import LogAction        from '../core/actions/logAction';
import Configuration    from '../tools/configuration';

export default class GlobalShortcuts
{
    public static initialize() : void
    {
        globalShortcut.register('CommandOrControl+X', () =>
        {
            ActionManager.instance.execute(new LogAction("Messajon"));
        });
        
        globalShortcut.register('CommandOrControl+X', () =>
        {
            ActionManager.instance.execute(new LogAction("Messajon"));
        });
    }
}
