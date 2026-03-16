import { LanguageRuntimes } from "../LanguageConfig.js";
import { startDockerForCompiler } from "../Docworker/dockerForCompilation.js";
import fs from 'fs'
import path from "node:path"

export const runCode=(ws,ptyContainer,lang,userFolder,codeFolder)=>{
ws.on('message',(data)=>{
    console.log(`received`,data);
    io.emit('message',data);
})
ws.on('run-code',({code,language})=>{
    lang=language;
    let runtime=LanguageRuntimes[lang];
    startDockerForCompiler(lang,ptyContainer,codeFolder,ws);
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

    ws.on('message',(data)=>{
    console.log(`received`,data);
    io.emit('message',data);
})
}
