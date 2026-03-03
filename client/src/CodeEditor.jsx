import React,{useEffect, useRef, useState} from 'react'
import Editor from '@monaco-editor/react';
function CodeEditor({socket,isClicked}) {
 
    const valueCode=`import { WebSocketServer } from 'ws'; // Use require if not using "type": "module" in package.json

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('A new client connected!');
  ws.send('Welcome to the WebSocket server!'); // Send a welcome message to the client

  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    // Log the received message
    console.log('received: %s', data);

    // Broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
`
   const EditorRef=useRef(null);
    const [codex,setCodex]=useState('>');
    const handleEditorMount=(editor)=>{
        EditorRef.current=editor;
    }
    const showValue=()=>{
      alert(EditorRef.current.getValue());  
    }
    useEffect(()=>{
        socket.emit('run-code',codex);
    },[isClicked])
    return (
        <div>
            <Editor 
            height="90vh"
            width="60vw"
             defaultLanguage="javascript"
              defaultValue={valueCode}
              value={codex}
              onChange={(newCode)=>{
                setCodex(newCode)
                socket.emit("message",codex)}}
              theme='vs-dark'
              onMount={handleEditorMount}
              />
            <button onClick={showValue} className='bg-blue-400 rounded-sm p-1 font-bold font-sans'>Show Value</button>
        </div>
    )
}

export default CodeEditor
