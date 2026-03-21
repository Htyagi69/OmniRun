import { useEffect, useState,useRef } from 'react';
import { Tree } from 'react-arborist';

// Helper to handle nested updates (Recursive)
const updateTreename=(tree,id,newname)=>{
  return (
    tree.map(node=>{
       if(node.id===id){
         return {...node,name:newname}
       }
       if(node.children){
        return {
          ...node,
          children:updateTreename(node.children,id,newname)
        }
       }
       return node;
    })
  )
}
const updateCodeFile=(tree,id,code)=>{
    return (
      tree.map(node=>{
        if(node.id===id){
          return {...node,value:code}
        };
        if (node.children) {
      return { ...node, children: updateCodeFile(node.children, id, code) };
    }
        return node;
      })
    )
}
const addNodeToTree = (tree, parentId, newNode) => {
  return tree.map((node) => {
    if (node.id === parentId) {
      // Found the folder! Return a copy with the new file added
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }
    if (node.children) {
      // Not here, search deeper
      return {
        ...node,
        children: addNodeToTree(node.children, parentId, newNode),
      };
    }
    return node;
  });
};

function Files({socket,setCode,code,isClicked,setIsClicked}) {
  const [db,setDB]=useState(null);
  const [data,setData] =useState([])
  const [activeFileId,setActivefileId]=useState();
  const [activeFolderId,setActiveFolderId]=useState();
  const [activefileName,setActivefileName]=useState('src/App.jsx');
  const [path,setPath]=useState("/");
  //Initialize database
  useEffect(()=>{
    // indexedDB.open()
    const request=window.indexedDB.open("IDE",1);
    request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
  };
  
  // onupgradeneeded → create store
  request.onupgradeneeded=(event)=>{
    const db=event.target.result;
    if (!db.objectStoreNames.contains("data")) {
    db.createObjectStore("data",{
      keyPath:"id",
    });
  }
  }
  
  // onsuccess
  request.onsuccess = (event) => {
    setDB(event.target.result);
    readFiles(event.target.result);
  };
  },[])
const addInitialFiles=()=>{
  const transaction=db.transaction("data","readwrite");
  const store=transaction.objectStore("data");
  data.forEach(file=>{
    store.put(file);
  })
};
function readFiles(db){
  const transaction=db.transaction("data","readonly");
  const store=transaction.objectStore("data");
  const request=store.get("root_structure");
  request.onsuccess=()=>{
    if(request.result){
    setData(request.result.tree);
    }else{
       const initialData = [
  {
    id: "1",
    name: "src",
    hierarcy:1,
    children: [
      {
        id: "d1",
        name: "main.jsx",
        value: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      },
      {
        id: "d2",
        name: "App.jsx",
        value: `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Hello from CodeAny!</h1>
      <p>Edit this file to see magic happen.</p>
    </div>
  )
}

export default App`
      },
      {
        id: "d3",
        name: "App.css",
        value: `.App { text-align: center; background-color: #282c34; min-height: 100vh; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }`
      },
      {
        id: "d4",
        name: "index.css",
        value: `body { margin: 0; font-family: sans-serif; }`
      }
    ]
  },
  {
    id: "2",
    name: "index.html",
    value: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
  },
  {
    id: "3",
    name: "vite.config.js",
    value: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    hmr: {
      clientPort: 5174 // Ensures hot reload works inside the iframe
    },
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self' *;",
    },
    watch: {
      usePolling: true,
      interval:100
    }
  }
})`
  },
  {
    id: "4",
    name: "package-lock.json",
    value: `{ "name": "vite-react-app", "lockfileVersion": 3 }`
  },
  {
    id: "5",
    name: "package.json",
    value: JSON.stringify({
      name: "vite-react-app",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "vite build"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@vitejs/plugin-react-swc": "^3.5.0",
        "vite": "^5.0.0"
      }
    }, null, 2)
  }
];

const nodeInitialData = [
  {
    id: "1",
    name: "index.js",
    value: `const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello from your custom Node server!');
});
server.listen(8081, () => console.log('Server running on port 8081'));`
  },
  {
    id: "2",
    name: "package.json",
    value: JSON.stringify({
      name: "node-app",
      type: "commonjs",
      dependencies: {}
    }, null, 2)
  }
];

        setData(initialData);
        saveToDB(db,initialData);
    }
  }
}

useEffect(()=>{
  if (activeFileId && code !== undefined) {
  handleUpdatedCode(code);
   }
   console.log(`path:${path}`);
   
},[code])

useEffect(()=>{
  if(isClicked){
    console.log("clicked",isClicked);
    if(socket){
        socket.emit("sync-full-project",{
      files:data,
      language:"react"
    })
  }
  }
  setIsClicked(false);
},[isClicked])

   useEffect(()=>{
   if (socket && typeof socket.emit === 'function') {
  socket.emit('update-File',{
    filePath:path,
    content:code,
  })
}
},[code,socket])

const saveToDB = (database, treeData) => {
    if (!database) return;
    const tx = database.transaction("data", "readwrite");
    tx.objectStore("data").put({ id: "root_structure", tree: treeData });
    console.log("db",db);
      console.log("codeFiles",data);
  };

  const handleRename=({id,name})=>{
     const newData=updateTreename(data,id,name);
     setData(newData);
     saveToDB(db,newData)
  }
  const handleUpdatedCode=(code)=>{
    if(!activeFileId) return;
    setData(prev=>{
      const newData=updateCodeFile(prev,activeFileId,code)
      saveToDB(db,newData);
      return newData;
    });
  }
const createfile = (activeFolderId) => {
  const newFile = { 
    id: Date.now().toString(), 
    name: "new-file.txt", 
    value: "" 
  };

  setData((prev) => {
    let newData;
    if (!activeFolderId) {
      newData = [...prev, newFile];
    } else {
      newData = addNodeToTree(prev, activeFolderId, newFile);
    }
    
    saveToDB(db, newData);
    return newData;
  });
};
const createFolder=(activeFolderId)=>{
      const newFolder={id:Date.now().toString(),name:"new-folder",hierarcy:1,children:[]}
     setData((prev) => {
    let newData;
    if (!activeFolderId) {
      newData = [...prev, newFolder];
    } else {
          const parentNode = findNode(prev, activeFolderId);
          const newHierarchy = parentNode.hierarcy + 1;
      // console.log('hierarcy',newHierarchy);
    
      newFolder.hierarcy=newHierarchy;
      newData = addNodeToTree(prev, activeFolderId, newFolder);
    }
    saveToDB(db, newData);
    return newData;
  });
     console.log('created folder',data);
   }

   const findNode = (tree, id) => {
  for (let node of tree) {
    if (node.id === id) return node;

    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// const deleteFile = (idToDelete) => {
//   // 1. Create a true copy
//   const copiedData = [...data]; 
  
//   // 2. Filter top level (fixed the .id access)
//   const newUpdate = copiedData.filter(node => node.id !== idToDelete);
  
//   setData(newUpdate);
//   saveToDB(db, newUpdate);
// };

// const deleteFolder = (idToDelete) => {
//   // This is essentially the same as deleteFile if we only look at the root
//   const newUpdate = data.filter(node => node.id !== idToDelete);
//   setData(newUpdate);
//   saveToDB(db, newUpdate);
// };

const deleteNode = (idToDelete) => {
  const recursiveFilter = (nodes) => {
    return nodes
      .filter((node) => node.id !== idToDelete) // Remove the node if it matches
      .map((node) => {
        // If the node has children, filter those too
        if (node.children) {
          return { ...node, children: recursiveFilter(node.children) };
        }
        return node;
      });
  };

  setData((prevData) => {
    const newData = recursiveFilter(prevData);
    saveToDB(db, newData);
    return newData;
  });
};

  return (
    <div className='bg-black'>
      <div className='bg-gray-500 flex justify-between rounded-sm m-2'>
        <p className='font-extrabold text-white ml-2'>Replit</p>
        <div className='flex gap-2 mr-2'>
      <button className='w-6 cursor-pointer' onClick={()=>createfile(activeFolderId)}><img src="file.png"/></button>
      <button className='w-6 cursor-pointer' onClick={()=>createFolder(activeFolderId)}><img src="folder.png"/></button>
        </div>
      </div>
    <Tree
      // initialData={data}
      data={data} 
      openByDefault={false}
      width={200}
      height={540}
      indent={24}
      rowHeight={36}
      overscanCount={1}
      paddingTop={30}
      paddingBottom={10}
      editable
      onRename={handleRename}
    >
      {(props)=><Node {...props} setCode={setCode}  deleteNode={deleteNode}  setActivefileId={setActivefileId} setActiveFolderId={setActiveFolderId} setActivefileName={setActivefileName} setPath={setPath}/>}
    </Tree>
    </div>
);
}

export default Files


function Node({ node, style, dragHandle,setCode,deleteNode,setActivefileId,setActiveFolderId,setActivefileName,setPath}) {

    let getFullPath=(currentNode)=>{
        const pathparts=[];
        let curr=currentNode;
        while(curr && !curr.isRoot){
          pathparts.unshift(curr.data.name) //Array ko shuru me add karo
          curr=curr.parent; 
        }   
        return pathparts.join('/');
    }
  return (
    <div
      style={style}
      ref={dragHandle}
      className={`flex items-center px-2 cursor-pointer hover:bg-gray-700 text-white
        ${node.isSelected ?'bg-blue-300':'hover:bg-gray-300'}`}
      onClick={() => {
        if(node.isLeaf){
          const fullPath=getFullPath(node);
          setCode(node.data.value)
          setActivefileId(node.data.id)
          setActivefileName(node.data.name)
          setPath(fullPath);
          console.log("path",fullPath);
          // console.log("code file ka ==>",node.data.value);
        }
        if (!node.isLeaf) {
          setActiveFolderId(node.data.id)
          // console.log("folder ka id ==>",node.data.id);
          node.toggle();   //  THIS opens/closes folder
        }
      }}

    >
      <span className="mr-2">
        {node.isLeaf ? "📄" : node.isOpen ? "📂" : "📁"}
      </span>
       {/* Rename */}
      {node.isEditing?(
         <input autoFocus defaultValue={node.data.name} 
         onBlur={(e)=>node.submit(e.target.value)}
         onKeyDown={(e)=>{
          if(e.key==='Enter') node.submit(e.target.value);
           if(e.key==='Escape') node.reset(); 
         }}
          className="bg-gray-800 outline-none px-1"
         />
      ):(
    <div 
  className='flex  justify-between w-45 group' 
  onDoubleClick={(e) => {
    e.stopPropagation(); 
    node.edit();
  }}
>
  <span className="truncate flex-1 text-sm">
    {node.data.name}
  </span>


  <button 
    onClick={(e) => {
      e.stopPropagation();
     if (node.isLeaf) {
      deleteNode(node.data.id);
    } else {
      // 2. Added a quick confirm for folders because they might contain files
      if (window.confirm(`Delete folder "${node.data.name}"?`)) {
        deleteNode(node.id);
      }
    }
    //  deleteNode(node.id)
    }}
    className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
  >
    <img 
      src='bin.png' 
      style={{ width: '14px', height: '14px', filter: 'invert(1)' }} 
      alt="delete"
    />
  </button>
</div>
      )}

    </div>
  );
}

