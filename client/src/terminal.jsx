import React,{useRef,useEffect} from 'react';
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";

function TerminalBox({socket,setIsClicked}) {
    const terminalRef=useRef(null);
    const xtermInstance=useRef(null);
    useEffect(()=>{
        const term=new Terminal({
            cursorBlink:true,
            theme: { background: '#1e1e1e'}
        });
        const fitAddon=new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
         requestAnimationFrame(() => {
        fitAddon.fit();
    });
        xtermInstance.current=term;
        term.onData((input)=>{
              if (input === '\r') {
                  socket.emit('terminal-input', '\r\n'); // Move to next line
                      } 
    // Detect Backspace
             else if (input === '\x7f') {
                   socket.emit('terminal-input', '\b \b'); // Move back, space (erase), move back
               } 
             else {
                    socket.emit('terminal-input', input);
               }
        })
         const handleOutput=(serverData)=>{
            term.write(serverData)
            setIsClicked(false);
         }
         socket.on('terminal-output',handleOutput)
        return ()=>{
            socket.off('terminal-output',handleOutput)
             term.dispose();
        }
    },[socket])
    return (
        <div className='flex flex-col'>
            <div className='bg-blue-500 flex justify-between p-1 rounded-sm'>
                <div className='border-2 p-1 font-bold text-white bg-black rounded-sm'>output</div>
                <button className='border-2 p-1 font-bold text-white bg-black rounded-sm pl-2 pr-2 hover:cursor-pointer hover:bg-white hover:text-black'>clear</button>
            </div>
        <div className='w-123 h-135' ref={terminalRef} style={{textAlign:'left'}}>
        </div>
        </div>
    )
}

export default TerminalBox
