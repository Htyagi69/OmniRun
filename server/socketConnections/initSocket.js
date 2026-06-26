import { Server } from "socket.io";
import path from 'node:path'
import fs from 'fs'
import { Syncing } from "./syncWithContainer.js";
import { UpdateFile } from "./updateFile.js";
import { runCode } from "./runTrigger.js";
import { terminalInput } from "./Terminalinput.js";
import {diconnection} from "./disconnect.js"
import { handleAuth } from "../Auth/Supabase.js";
import { createTerminal } from "./createTerminal.js";

export const init=(server,codeFolder)=>{

const userContainers=new Map(); 
const io=new Server(server,{
    cors:{
       origin:'http://localhost:5173',
       methods:['POST','GET'],
       credentials:true,
  }
})
io.on('connection',(ws)=>{
    // await handleAuth(ws);
    console.log('A new client is connected',ws.id);
    ws.on('error',console.error)
     const userId=ws.handshake.auth.userId;
     if(!userId){
         console.error("No userId in auth");
         ws.disconnect();
         return;
     }
    const userFolder=path.join(codeFolder,userId)
    if(!fs.existsSync(userFolder)) fs.mkdirSync(userFolder)

let lang=null;
//Jab hum Object bhejte hain (ptyContainer), toh function us object ke Reference (address) ko pakad leta hai. Jab aap main file mein ptyContainer.process ko change karte ho, toh function ko wahi updated value milti hai.
if(!userContainers.has(userId)) { 
   userContainers.set(userId,
   { process: null,
    containerName:null,
    terminals:new Map(),
    language:null,
    activeTerminalId:null
})
};

const ptyContainer=userContainers.get(userId);

 runCode(ws,ptyContainer,lang,userFolder,codeFolder);
 Syncing(ws,ptyContainer,userFolder,codeFolder);
 UpdateFile(ws,userFolder);
 terminalInput(ws,ptyContainer);
 createTerminal(ws, ptyContainer);  // Set up listener once

ws.on('sync-full-project', ({language}) => {
    lang = language;
    ptyContainer.language = language;
});

 diconnection(ws,ptyContainer,userFolder);
})
}