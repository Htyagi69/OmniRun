import { LanguageRuntimes } from "../LanguageConfig.js";
import { startDockerForCompiler } from "../Docworker/dockerForCompilation.js";
import fs from 'fs'
import path from "node:path"
import {execSync} from 'child_process' 

export const runCode=(ws,ptyContainer,lang,userFolder,codeFolder)=>{
// ws.on('message',(data)=>{
//     console.log(`received`,data);
//     io.emit('message',data);
// })
ws.on('run-code',({code,language,activeTerminal})=>{
    lang=language;
    let runtime=LanguageRuntimes[lang];
    
    console.error("ptycontainer",ptyContainer);
    
    if (ptyContainer.language && ptyContainer.language !== language && ptyContainer.containerName) {
        // console.log("Language changed, recreating container...");
        try {
            if (ptyContainer.process) ptyContainer.process.kill();
            execSync(`docker stop ${ptyContainer.containerName}`);
            execSync(`docker rm ${ptyContainer.containerName}`);
        } catch (err) {
            console.error("Error:", err.message);
        }
            ptyContainer.process = null;
            ptyContainer.containerName = null; 
            ptyContainer.terminals = new Map();
        }
        
        ptyContainer.language = language;


    if(!ptyContainer.process || ptyContainer.language!=language){
        startDockerForCompiler(lang,ptyContainer,userFolder,ws,activeTerminal);
        //    console.error("Container not running");
        //     return;
    }

    // console.log("code=====>",code);
    console.log("language",language);
    
    // const filePath=path.join(userFolder,'user_code.cpp');
    const filePath=path.join(userFolder,runtime.fileName);
    fs.writeFileSync(filePath,code);
    setTimeout(()=>{
            // Clear terminal screen and run
                // We use \u000c to clear the terminal for a clean run
            ptyContainer.process.write('\u000c');
            // Compile the code that was saved in user_storage
            ptyContainer.process.write(runtime.Compilecmd);
        },1000)
    })

    // ws.on('message',(data)=>{
    // console.log(`received`,data);
    // io.emit('message',data);
// })
}
