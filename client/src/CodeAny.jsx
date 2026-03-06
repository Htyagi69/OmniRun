import { useState } from 'react'
import CodeEditor from './CodeEditor'
import './App.css'
import TerminalBox from './terminal'
import { LanguageBox } from './components/Language'

function CodeAny({socket}){
  const [lang,setLang]=useState('cpp');
  const [isClicked,setIsClicked]=useState(false);
  socket.on('message',data=>{
    setMessages((prev)=>[...prev,data])
    console.log("mess:",messages);
    // socket.emit('message',messages)
  })
  return (
    <div className=' bg-green-400' >
    {/* <h1 className='text-green-600 text-4xl font-extrabold'>OmniVerse</h1> */}
    <div className='flex justify-between'>
    <LanguageBox socket={socket} setLang={setLang}/>
    <button onClick={()=>setIsClicked(true)} className={`flex w-34 bg-blue-400 cursor-pointer hover:bg-gray-500 p-2 font-bold justify-center rounded-sm mr-2 ${isClicked ? 'bg-white text-black':' bg-blue-400 text-white'}`}>Run code</button>
    </div>
    <div className='flex'>
     <CodeEditor socket={socket} isClicked={isClicked} lang={lang}/>
     <div className='flex flex-col border-2'>
     <TerminalBox socket={socket} setIsClicked={setIsClicked} />
      </div>
    </div>
    </div>
  );
}

export default CodeAny