import { LanguageRuntimes } from "../LanguageConfig.js";
import  * as pty from 'node-pty'
import path from 'node:path'

export const startDockerForWebsite=(language,ptyContainer,codeFolder,ws)=>{
    if(ptyContainer.process){
        ptyContainer.process.kill();
        ptyContainer.process=null;
    }
     const userFolder=path.join(codeFolder,ws.id)
        //PTY process
   const runtime = LanguageRuntimes[language.toLowerCase()];
    const dockerArgs = [
    'run', '-it', '--rm',
    '--memory', '512m',
    '--cpus', '0.5',
    // THIS IS THE KEY PART:
    '-v', `${userFolder}:/app`,  // Map host userFolder to container /app
    '-w', '/app',                // Tell Docker to start inside /app
];
// Add this so the iframe can actually see the website!
const port = runtime.port || 5174;
    dockerArgs.push('-p', `${port}:${port}`);

dockerArgs.push(runtime.image, runtime.shell);
     ptyContainer.process=pty.spawn('docker',dockerArgs,{
    name:'xterm-color',
    rows:30,
    cols:80,
    cwd:process.env.HOME,
    env:process.env
})

ptyContainer.process.onData((data)=>{
    // process.stdout.write(data);
    ws.emit('terminal-output',data)
})
}
