import path from 'node:path'
import fs from 'fs'
import { startDockerForWebsite } from '../Docworker/dockerWorkerForWebsite.js'
import { LanguageRuntimes } from '../LanguageConfig.js'

export const Syncing=(ws,ptyContainer,userFolder,codeFolder)=>{
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
        
        startDockerForWebsite(language,ptyContainer,codeFolder,ws);
        //For instant boot up we preinstalled npm i in docker
        let runtime=LanguageRuntimes[language];
        setTimeout(() => {
    // ptyProcess.write(`${installCmd}npm run dev -- --host\r`);
    ptyContainer.process.write(`${runtime.Compilecmd}`);
    
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
    }
