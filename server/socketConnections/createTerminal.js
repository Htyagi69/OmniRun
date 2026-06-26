import * as pty from 'node-pty'
import { LanguageRuntimes } from '../LanguageConfig.js'

export const createTerminal=(ws,ptyContainer)=>{
       ws.on('create-terminal',({terminalId,folder})=>{
        if(!ptyContainer.containerName){
             console.error("Container not running");
            ws.emit('error', { message: 'Container not running' });
            return;
        }

        if(!ptyContainer) return;
        setTimeout(()=>{
            const runtime=LanguageRuntimes[ptyContainer.language.toLowerCase()];
            const terminalPty = pty.spawn('docker', [
            'exec', '-it',
            '-w', folder || '/app',
            ptyContainer.containerName,
            runtime.shell
        ], {
            name: 'xterm-color',
            rows: 30,
            cols: 80
        });
        ptyContainer.terminals.set(terminalId,terminalPty)
        
        terminalPty.onData((data)=>{
            ws.emit('terminal-output',{terminalId,data});
        })
        console.log("Terminal created:", terminalId);
    },500)
})
}