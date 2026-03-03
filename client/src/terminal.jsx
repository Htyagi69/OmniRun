import React,{useRef,useEffect} from 'react';
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";

function TerminalBox({socket}) {
    const terminalRef=useRef(null);
    const xtermInstance=useRef(null);
    useEffect(()=>{
        const term=new Terminal({
            cursorBlink:true,
            theme: { background: '#1e1e1e' }
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
         }
         socket.on('terminal-output',handleOutput)
        return ()=>{
            socket.off('terminal-output',handleOutput)
             term.dispose();
        }
    },[socket])
    return (
        <div className='w-123 h-144' ref={terminalRef} style={{textAlign:'left'}}>
        </div>
    )
}

export default TerminalBox
