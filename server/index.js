import http from 'http'
import express from 'express'
import {Server} from 'socket.io'
import * as os from 'node:os'
import * as pty from 'node-pty'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {LanguageRuntimes} from './LanguageConfig.js'

const app=express();
const server=http.createServer(app)
const PORT=8080;

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const codeFolder=path.resolve(__dirname,'user_storage').replace(/\\/g, '/');
if(!fs.existsSync(codeFolder)){
    fs.mkdirSync(codeFolder);
}

const io=new Server(server,{
    cors:{
    origin:'http://localhost:5173',
    methods:['POST','GET'],
    credentials:true,
}
})
io.on('connection',(ws)=>{
    console.log('A new client is connected',ws.id);
    ws.on('error',console.error)

    const userFolder=path.join(codeFolder,ws.id)
    if(!fs.existsSync(userFolder)) fs.mkdirSync(userFolder)

let lang=null;
let ptyProcess=null;
const startDockerForCompiler=(language)=>{
    if(ptyProcess){
        ptyProcess.kill();
        ptyProcess=null;
    }
        //PTY process
    const runtime=LanguageRuntimes[language];
     ptyProcess=pty.spawn('docker',['run',
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

ptyProcess.onData((data)=>{
    // process.stdout.write(data);
    ws.emit('terminal-output',data)
})
}
const startDockerForWebsite=(language)=>{
    if(ptyProcess){
        ptyProcess.kill();
        ptyProcess=null;
    }
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
     ptyProcess=pty.spawn('docker',dockerArgs,{
    name:'xterm-color',
    rows:30,
    cols:80,
    cwd:process.env.HOME,
    env:process.env
})

ptyProcess.onData((data)=>{
    // process.stdout.write(data);
    ws.emit('terminal-output',data)
})
}

ws.on('message',(data)=>{
    console.log(`received`,data);
    io.emit('message',data);
})
ws.on('run-code',({code,language})=>{
    lang=language;
    let runtime=LanguageRuntimes[lang];
    startDockerForCompiler(lang);
    // console.log("code=====>",code);
    console.log("language",language);
    
    // const filePath=path.join(userFolder,'user_code.cpp');
    const filePath=path.join(userFolder,runtime.fileName);
    fs.writeFileSync(filePath,code);
    setTimeout(()=>{
            // Clear terminal screen and run
                // We use \u000c to clear the terminal for a clean run
            ptyProcess.write('\u000c');
            // Compile the code that was saved in user_storage
            ptyProcess.write(runtime.Compilecmd);
        },1000)
    })

 ws.on("sync-full-project",({files,language})=>{
     
     const writeFilesInLocal=(basePath,items)=>{
         items.forEach(item => {
             const currentPath=path.join(basePath,item.name);
             if(item.children){
                 if (!fs.existsSync(currentPath)) {
                     fs.mkdirSync(currentPath, { recursive: true });
                 }                      
                     writeFilesInLocal(currentPath,item.children);
                    }else{
                        console.log(`Writing file: ${item.name} to ${currentPath}`);
                        fs.writeFileSync(currentPath, item.value || "");
                    }
                }
            );
            // console.log("CodeFiles",files);
        }

        writeFilesInLocal(userFolder,files);
        console.log(`Project synced for ${ws.id}`);
        
        startDockerForWebsite(language);
        //For instant boot up we preinstalled npm i in docker
        let runtime=LanguageRuntimes[language];
        setTimeout(() => {
    // ptyProcess.write(`${installCmd}npm run dev -- --host\r`);
    ptyProcess.write(`${runtime.Compilecmd}`);
    
    }, 1000);

    //********For setup the complete project using itself npm install on everry project run 
    // Instead of just npm run dev, check if install is needed
        //       const installCmd = fs.existsSync(path.join(userFolder, 'node_modules')) 
        //     ? "" 
        //     : "npm install && ";
        
        // // Use a small timeout to let the container shell boot up
        // setTimeout(() => {
        //     ptyProcess.write(`${installCmd}npm run dev -- --host\r`);
        // }, 1000);
 })
 
 ws.on('update-File',({filePath,content})=>{
    if (!filePath || content === undefined) {
        console.error("Invalid file update received:", { filePath, content });
        return; 
    }
    const absolutePath=path.join(userFolder,filePath);
    const directoryPath=path.dirname(absolutePath)
    if(!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath, {recursive:true});
        console.log(`Created missing directory: ${directoryPath}`);
    }
    fs.writeFileSync(absolutePath,content);
    console.log(`content:${content}`);
    console.log(`File updated:${filePath}`);
 })
    ws.on('terminal-input',(userInput)=>{
        if(ptyProcess)
        ptyProcess.write(userInput);
    })


    ws.on('disconnect',()=>{
        if(ptyProcess){
            ptyProcess.kill()
            ptyProcess=null;
        }
        fs.rmSync(userFolder, { recursive: true, force: true });
        console.log('Client disconnected');
        console.log('User logged out, terminal killed.');
    })
})

// const shell=os.platform()==='win32'?'powershell.exe':'bash';



app.get('/',(req,res)=>{
    res.json({message:'thanks for server'})
})

server.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})