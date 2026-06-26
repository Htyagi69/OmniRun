 export const terminalInput=(ws,ptyContainer)=>{

     ws.on('terminal-input',({terminalId,input})=>{
        let pty;
        if(terminalId==='0'){
            pty=ptyContainer.process;
        }else{
           pty= ptyContainer.terminals.get(terminalId);
        }
         if(pty)
            pty.write(input);
    })
}
