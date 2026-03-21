import { useEffect, useState } from 'react'
import './App.css'
import { TabsIcons } from './components/Tabs'
import  CodeAny  from './CodeAny'
import  Website  from './Webpage'
import { io } from 'socket.io-client'
import Authclient from './Auth/SupabaseClient'
import { AvatarGroups} from './components/usersAvatar'

function App() {
  const [socket,setSocket]=useState(null);
  const [checkPoint,setCheckPoint]=useState(false);
  const [compiler,setCompiler]=useState(false);
  // useEffect(()=>{
  //    let socketInstance;
  //   if(checkPoint && !socket){
  //     socketInstance=io('http://localhost:8080');
  //     setSocket(socketInstance)
  //     return ()=>{
  //        if (socketInstance) {
  //         socketInstance.disconnect();
  //         setSocket(null);
  //       }
  //       }
  //   }
  // },[checkPoint])

      return (
        <div>
          { checkPoint? (
            <>
            <div className='flex justify-between bg-gray-800'>
              <div className='border-2 rounded-3xl bg-white ml-2'>
              <img src="/logo.svg" alt="Company Logo" width="30" height="30" />
                   </div>
            <div className='flex justify-center bg-gray-800'>
               <TabsIcons setCompiler={setCompiler}/>
            </div>
            <div className='bg-gray-800'>
            <AvatarGroups/>
            </div>
            </div>
          { compiler ?(
            <CodeAny socket={socket}/>
          ):(
            <Website  socket={socket}/>
          )
        }
        </>
          ):(
            <Authclient setCheckPoint={setCheckPoint} checkPoint={checkPoint} socket={socket} setSocket={setSocket} />     
          ) 
          }
        </div>
      )
}

export default App


