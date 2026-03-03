import { useState } from 'react'
import CodeEditor from './CodeEditor'
import './App.css'
import TerminalBox from './terminal'
import {io} from 'socket.io-client'
import { LanguageBox } from './components/Language'

const socket=io('http://localhost:8080')

function App() {
  const [messages, setMessages] = useState(["hello"]);
  const [lang,setLang]=useState('cpp');
  const [isClicked,setIsClicked]=useState(false);
  socket.on('message',data=>{
    setMessages((prev)=>[...prev,data])
    console.log("mess:",messages);
    // socket.emit('message',messages)
  })
  return (
    <div className=' bg-amber-400' >
    <h1 className='text-green-600 text-4xl font-extrabold'>Hello</h1>
    <div className='flex justify-between'>
    <LanguageBox socket={socket} setLang={setLang}/>
    <button onClick={()=>setIsClicked(true)} className={`flex bg-blue-400  p-2 font-bold justify-center rounded-2xl ${isClicked ? 'bg-white text-black':' bg-blue-400'}`}>Run code</button>
    </div>
    <div className='flex  border-4'>
     <CodeEditor socket={socket} isClicked={isClicked} lang={lang}/>
     <div className='flex flex-col border-2 '>
     <TerminalBox socket={socket} setIsClicked={setIsClicked} />
     {/* <TerminalBox socket={socket} data={messages[messages.length-1]}/> */}
     {/* {messages.map((message,index)=>(
       <div key={index}>{message}</div>
      ))} */}
      </div>
    </div>
    <div className='w-full bg-black border-2 '>
      <iframe src="https://code-editor-blwn.vercel.app/" width="1250px"></iframe>
    </div>
    </div>
  )
}

export default App
