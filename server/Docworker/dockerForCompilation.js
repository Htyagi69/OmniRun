import { LanguageRuntimes } from "../LanguageConfig.js";
import path from 'node:path'
import  * as pty from 'node-pty'

export const startDockerForCompiler=(language,ptyContainer,codeFolder,ws)=>{
        if(ptyContainer.process){
        ptyContainer.process.kill();
        ptyContainer.process=null;
    }
     const userFolder=path.join(codeFolder,ws.id)
        //PTY process
    const runtime=LanguageRuntimes[language];
     ptyContainer.process=pty.spawn('docker',['run',
    '-it','--rm',
    '--memory', '512m',           // Limit RAM (Security)
    '--cpus', '0.5',               // Limit CPU (Security)
    '-v', `${userFolder}:/app`,    // MOUNT THE USER FOLDER DIRECTLY
    '-w', '/app',                   // Start inside /app     
    runtime.image,                    
    runtime.shell,                    
],{
    name:'xterm-color',
    rows:30,
    cols:80,
    cwd:process.env.HOME,
    env:process.env
})

ptyContainer.process.onData((data)=>{
        console.log("data in terminal",data)
    // process.stdout.write(data);
    ws.emit('terminal-output',data)
})
}