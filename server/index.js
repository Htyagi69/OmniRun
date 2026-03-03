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
const startDocker=(language)=>{
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

ws.on('message',(data)=>{
    console.log(`received`,data);
    io.emit('message',data);
})
ws.on('run-code',({code,language})=>{
    lang=language;
    let runtime=LanguageRuntimes[lang];
    startDocker(lang);
    console.log("code=====>",code);
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