 import path from 'node:path'
 import fs from 'fs'
 export const UpdateFile=(ws,userFolder)=>{
     
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

}
