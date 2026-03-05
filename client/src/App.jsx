import { useState } from 'react'
import './App.css'
import { TabsIcons } from './components/Tabs'
import  CodeAny  from './CodeAny'
import  Website  from './Webpage'
import { io } from 'socket.io-client'

const socket=io('http://localhost:8080')

function App() {
  const [compiler,setCompiler]=useState(false);
      return (
        <div>   
          <div className='flex justify-center bg-green-500'>
            <TabsIcons setCompiler={setCompiler}/>
         </div>
        { compiler ?(
        <CodeAny socket={socket}/>
        ):(
          <Website  socket={socket}/>
        )
        }
        </div>
      )
}

export default App


