import React, { useState } from 'react'
import TerminalBox
 from './terminal';
function TerminalContainer({socket,setIsClicked,setPreview,activeTerminalId,setActiveTerminalId}) {
    
const [terminals,setTerminals]=useState([
    {id:'0',folder:'/app'}
])

const addTerminal=()=>{
    const newId=Date.now().toString();
    socket.emit('create-terminal',{terminalId:newId,folder:'/app'})
    setTerminals([...terminals,{id:newId,folder:'/app'}])
}

const removeTerminal=(id)=>{
      setTerminals(terminals.filter(t=>t.id!==id))
}
    return (
    <div className='flex flex-col h-full'>
            <div className='flex gap-2 bg-gray-700 p-2'>
                <button 
                    onClick={addTerminal}
                    className='bg-green-500 text-white px-3 py-1 rounded'
                >
                    + New Terminal

                </button>
                <span className='text-white'>Active:{activeTerminalId}</span>
            </div>
            
            <div className='flex-1 flex gap-2 overflow-auto'>
                {terminals.map(term => (
                    <div key={term.id} className='flex-1 min-w-0'
                    onClick={()=>
                    {
                        setActiveTerminalId(term.id);
                        socket.emit('select-terminal',{terminalId:term.id})
                    }}>
                        <TerminalBox
                            key={term.id} 
                            socket={socket}
                            terminalId={term.id}
                            folder={term.folder}
                            setIsClicked={setIsClicked}
                            setPreview={setPreview}
                            isActive={activeTerminalId==term.id}
                            onClose={() => removeTerminal(term.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TerminalContainer
