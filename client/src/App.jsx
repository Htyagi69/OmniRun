import { useEffect, useState } from 'react'
import './App.css'
import { TabsIcons } from './components/Tabs'
import  CodeAny  from './CodeAny'
import  Website  from './Webpage'
import Authclient from './Auth/SupabaseClient'
import { AvatarGroups} from './components/usersAvatar'
import { createClient } from '@supabase/supabase-js'
import { io } from "socket.io-client";
import { Toaster } from 'sonner'
import { Button } from './components/ui/button'
import { toast } from 'sonner'

const supabase=createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

function App() {
  const [socket,setSocket]=useState(null);
  const [checkPoint,setCheckPoint]=useState(false);
  const [compiler,setCompiler]=useState(false);
    const [checkAuth,setAuth]=useState(true);

      const createSocketConnection=(data)=>{
            if(data?.session){
        const newSocket=io('http://localhost:8080',{
            auth:{
                token:data.session.access_token,
            }
        })
      newSocket.on('connect',()=>{
          console.log("Connection established",newSocket.id)
          setCheckPoint(true)
      })
       setSocket(newSocket)
    }
    }
useEffect(()=>{
        const {data:{subscription}}= supabase.auth.onAuthStateChange((event,session)=>{
               if(session){
                createSocketConnection({session})
                setAuth(false);
               }else{
                setAuth(false)
               }
        })
     return ()=>subscription.unsubscribe();
},[checkPoint])

  const handleLogout = async () => {
     await supabase.auth.signOut();
    toast.success("Logout sucessfully")
    setCheckPoint(false)
    setAuth(true)
  }

        if(checkAuth) 
          return(
           <div className="w-full h-screen bg-gray-400 flex items-center justify-center">
                <p className="text-white text-2xl font-serif">
                  Checking session...</p>
            </div>
            )

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
            <div className='bg-gray-800 flex gap-2'>
            <AvatarGroups/>
            <Button variant='outline' 
            className='cursor-pointer hover:bg-black hover:text-white'
            onClick={handleLogout}
            >Logout</Button>
            </div>
            </div>
          { compiler ?(
            <>
            <CodeAny socket={socket}/>
            </>
          ):(
            <>
            <Website  socket={socket}/>
            </>
          )
        }
        </>
          ):(
            <>
            <Authclient supabase={supabase} 
            createSocketConnection={createSocketConnection}  />     
            </>
          ) 
   }
        </div>
      )
}

export default App


