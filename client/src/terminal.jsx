import React,{useRef,useEffect} from 'react';
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";

function TerminalBox({socket,setIsClicked,setPreview,terminalId,onClose,folder,isActive}) {
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
            if(!socket) return;
           if (input === '\r') {
        socket.emit('terminal-input', { terminalId, input: '\r\n' });
    } else if (input === '\x7f') {
        socket.emit('terminal-input', { terminalId, input: '\b \b' });
    } else {
        socket.emit('terminal-input', { terminalId, input });
    }
        })
         const handleOutput=(serverData)=>{
            // console.log('state got it',serverData.includes('ready in'));
            if(serverData.terminalId==terminalId){

                if(serverData.data.includes('ready in')){
                    setPreview(true);
                }
                console.log(serverData.data);
                term.write(serverData.data)
                setIsClicked(false);
            }
        }
            socket.on('terminal-output',handleOutput)
        return ()=>{
            socket.off('terminal-output',handleOutput)
             term.dispose();
        }
    },[socket,terminalId])
    return (
        <div className={`flex flex-col w-full h-full ${isActive ? 'border-2 border-green-500' : ''}`}>
            <div className='bg-blue-500 flex justify-between p-1 rounded-sm'>
                <div className='border-2 px-2 font-bold text-white bg-black rounded-sm'>output</div>
                <div className='text-white bg-black px-2'>Terminal {terminalId}</div>
                <button onClick={onClose} className='bg-red-500 text-white px-2'>×</button>
                <button 
                className='border-2 p-1 font-bold text-white bg-black rounded-sm pl-2 pr-2 hover:cursor-pointer hover:bg-white hover:text-black'
                onClick={()=>socket.emit('terminal-input',{terminalId,input:'clear \n'})}>clear</button>
            </div>
        <div style={{ flex: 1, minHeight: 0, width: '100%' ,textAlign:'left'}} ref={terminalRef}>
        </div>
        </div>
    )
}

export default TerminalBox
