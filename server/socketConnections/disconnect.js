import fs from 'fs'

export const diconnection=(ws,ptyContainer,userFolder)=>{

    ws.on('disconnect',()=>{
        if(ptyContainer.process){
            ptyContainer.process.kill()
            ptyContainer.process=null;
        }
        fs.rmSync(userFolder, { recursive: true, force: true });
        console.log('Client disconnected');
        console.log('User logged out, terminal killed.');
    })
}
