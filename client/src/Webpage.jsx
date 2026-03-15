import { useEffect, useState } from 'react'
import WebEditor from './WebEditor'
import './App.css'
import TerminalBox from './terminal'
import { LanguageBox } from './components/Language'
import Files from './Files'

function Website({socket}){
  const [lang,setLang]=useState('javascript');
  const [code,setCode]=useState();
  const [isClicked,setIsClicked]=useState(false);
  const [loadSite,setLoadSite]=useState(false);

  return (
    <div className=' bg-green-400' >
    {/* <h1 className='text-green-600 text-4xl font-extrabold'>OmniVerse</h1> */}
    <div className='flex justify-between'>
    {/* <LanguageBox socket={socket} setLang={setLang}/> */}
    <button onClick={()=>{
      setIsClicked(true)
    }} 
      className={`flex w-full cursor-pointer hover:bg-gray-600 m-2 bg-blue-400  p-2 font-bold justify-center rounded-sm mr-2 ${isClicked ? 'bg-white text-black':' bg-blue-400 text-white'}`}
      >
        Build code
        </button>
    </div>
    <div className='flex'>
         <Files socket={socket} setCode={setCode} code={code} isClicked={isClicked} setIsClicked={setIsClicked}/>
     <WebEditor socket={socket} isClicked={isClicked} lang={lang} setCode={setCode} code={code}/>
     <div className='flex flex-col border-2'>
     <TerminalBox socket={socket} setIsClicked={setIsClicked}  setPreview={setLoadSite}/>
      </div>
    </div>
    <div className='w-full bg-black border-2 '>
      {loadSite?(<iframe src="http://localhost:5174" width="1250px" height="620px"></iframe>):(<div className='bg-black text-white font-bold'>Starting server... Please wait</div>)}
      {/* <iframe src="https://code-editor-blwn.vercel.app/" width="1250px"></iframe> */}
    </div>
    </div>
  );
}

export default Website

