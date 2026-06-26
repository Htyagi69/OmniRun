import { LanguageRuntimes } from "../LanguageConfig.js";
import  * as pty from 'node-pty'
import path from 'node:path'

export const startDockerForWebsite=(language,ptyContainer,userFolder,ws,activeTerminal)=>{
    // if(ptyContainer.process){
    //     ptyContainer.process.kill();
    //     ptyContainer.process=null;
    // }

    //  const userFolder=path.join(codeFolder,ws.id)
     console.log("folders",userFolder)
     if(ptyContainer.containerName){
          console.log("Container already running, reusing...");
        return;
     }
        //PTY process
   const runtime = LanguageRuntimes[language.toLowerCase()];
   const containerName=`replit-${ws.handshake.auth.userId}-${Date.now()}`
    const dockerArgs = [
    'run', '-it', '--rm','--name',containerName,
    '--memory', '512m',
    '--cpus', '0.5',
    // THIS IS THE KEY PART:
    '-v', `${userFolder}:/app`,  // Map host userFolder to container /app
    '-w', '/app',                // Tell Docker to start inside /app
];

ptyContainer.containerName=containerName;
ptyContainer.terminals=new Map();

ws.on('select-terminal',({terminalId})=>{
      ptyContainer.activeTerminalId = terminalId;
    console.log('Terminal selected:', terminalId);
})
// Add this so the iframe can actually see the website!
const port = runtime.port || 5174;
    dockerArgs.push('-p', `${port}:${port}`);
    dockerArgs.push('-p', '8081:8081'); // 🔥 ADD THIS

dockerArgs.push(runtime.image, runtime.shell);
     ptyContainer.process=pty.spawn('docker',dockerArgs,{
    name:'xterm-color',
    rows:30,
    cols:80,
    cwd:process.env.HOME,
    env:process.env
})
console.log("port",port);

ptyContainer.process.onData((data)=>{
    // process.stdout.write(data);
    console.log("data in terminal",data)
    const terminalId=ptyContainer.activeTerminalId || '0';
    ws.emit('terminal-output',{terminalId,data});
})
console.log("Container started:", containerName);
}
