// Node Modules
import {globalShortcut } from 'electron';

// Local Modules
import ActionManager    from '../core/actionManager';
import LogAction        from '../core/actions/logAction';
import Application      from '../core/application';
import Configuration    from '../tools/configuration';

export default class GlobalShortcuts
{
    public static initialize() : void
    {
        globalShortcut.register("CommandOrControl+R", () =>
        {
            // Check window visibility
        });
    }
}
