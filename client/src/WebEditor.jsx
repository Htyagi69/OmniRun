import React,{useEffect, useRef, useState} from 'react'
import Editor from '@monaco-editor/react';
import {StarterCode} from './constants'
function WebEditor({socket,isClicked,lang,setCode,code}) {
  const EditorRef=useRef(null);
    const [codex,setCodex]=useState();
    const handleEditorMount=(editor)=>{
        EditorRef.current=editor;
    }
    const showValue=()=>{
      alert(EditorRef.current.getValue());        
    }
    
    useEffect(()=>{
      if(isClicked){
        socket.emit('run-code',{code:codex,language:lang});
      }
    },[isClicked])
    useEffect(()=>{
      setCodex(StarterCode[lang]);
    },[lang])
    return (
        <div>
            <Editor 
            height="92vh"
            width="45vw"
             defaultLanguage="cpp"
              defaultValue={StarterCode[lang]}
              value={code}
              onChange={(newCode)=>{
                setCodex(newCode)
                setCode(newCode)
                // socket.emit("message",codex)
                }}
              theme='vs-dark'
              onMount={handleEditorMount}
              />
            {/* <button onClick={showValue} className='bg-blue-400 rounded-sm p-1 font-bold font-sans'>Show Value</button> */}
        </div>
    )
}

export default WebEditor
