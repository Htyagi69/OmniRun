import { useState } from 'react'
import CodeEditor from './CodeEditor'
import './App.css'
import TerminalBox from './terminal'
import {io} from 'socket.io-client'

const socket=io('http://localhost:8080')

function App() {
  const [messages, setMessages] = useState(["hello"]);
  const [isClicked,setIsClicked]=useState(false);
  socket.on('message',data=>{
    setMessages((prev)=>[...prev,data])
    console.log("mess:",messages);
    // socket.emit('message',messages)
  })
  return (
    <div className=' bg-amber-400' >
    <h1 className='text-green-600 text-4xl font-extrabold'>Hello</h1>
    <button onClick={()=>setIsClicked(true)} className={`flex bg-blue-400 w-full p-2 font-bold justify-center rounded-2xl ${isClicked ? 'bg-white text-black':' bg-blue-400'}`}>Run code</button>
    <div className='flex  border-4'>
     <CodeEditor socket={socket} isClicked={isClicked}/>
     <div className='flex flex-col border-2'>
     <TerminalBox socket={socket} />
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
