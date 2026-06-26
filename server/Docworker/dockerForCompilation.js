import { LanguageRuntimes } from "../LanguageConfig.js";
import path from 'node:path'
import  * as pty from 'node-pty'

export const startDockerForCompiler=(language,ptyContainer,userFolder,ws,activeTerminal)=>{
    //     if(ptyContainer.process){
    //     ptyContainer.process.kill();
    //     ptyContainer.process=null;
    // }
    //  const userFolder=path.join(codeFolder,ws.id)
    if(ptyContainer.containerName){
          console.log("Container already running, reusing...");
        return;
     }
        //PTY process
    const runtime=LanguageRuntimes[language];
     const containerName=`replit-${ws.handshake.auth.userId}-${Date.now()}`
     ptyContainer.process=pty.spawn('docker',['run',
    '-it','--rm','--name',containerName,
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

ptyContainer.containerName=containerName;
ptyContainer.terminals=new Map();

ws.on('select-terminal',({terminalId})=>{
      ptyContainer.activeTerminalId = terminalId;
    console.log('Terminal selected:', terminalId);
})

ptyContainer.process.onData((data)=>{

        console.log("active",activeTerminal)
        console.log("data in terminal",data)
    // process.stdout.write(data);
    ws.emit('terminal-output',data);
    const terminalId = ptyContainer.activeTerminalId || '0';
    ws.emit('terminal-output',{terminalId,data});
})
console.log("Container started:", containerName);

}