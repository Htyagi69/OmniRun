import { Server } from "socket.io";
import path from 'node:path'
import fs from 'fs'
import { Syncing } from "./syncWithContainer.js";
import { UpdateFile } from "./updateFile.js";
import { runCode } from "./runTrigger.js";
import { terminalInput } from "./Terminalinput.js";
import {diconnection} from "./disconnect.js"

export const init=(server,codeFolder)=>{

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
//Jab hum Object bhejte hain (ptyContainer), toh function us object ke Reference (address) ko pakad leta hai. Jab aap main file mein ptyContainer.process ko change karte ho, toh function ko wahi updated value milti hai.
const ptyContainer = { process: null };
 runCode(ws,ptyContainer,lang,userFolder,codeFolder);
 Syncing(ws,ptyContainer,userFolder,codeFolder);
 UpdateFile(ws,userFolder);
 terminalInput(ws,ptyContainer);
 diconnection(ws,ptyContainer,userFolder);
})
}