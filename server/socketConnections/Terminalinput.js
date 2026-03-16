 export const terminalInput=(ws,ptyContainer)=>{

     ws.on('terminal-input',(userInput)=>{
         if(ptyContainer.process)
            ptyContainer.process.write(userInput);
    })
}
