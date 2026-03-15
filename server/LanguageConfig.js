export const LanguageRuntimes={
    c:{
        image:'gcc',
        shell:'bash',
        Compilecmd:'gcc user_code.c -o out && ./out\r',
        fileName:'user_code.c'
    },
    cpp:{
        image:'gcc',
        shell:'bash',
        Compilecmd:'g++ user_code.cpp -o out && ./out\r',
        fileName:'user_code.cpp'
    },
    java:{
        image:'bellsoft/liberica-openjdk-alpine:17',
        shell:'sh',
        Compilecmd:'javac Main.java && java Main\r',
        fileName:'Main.java'
    },
    python:{
        image:'python:3.10-slim',
        shell:'bash',
        Compilecmd:'python user_code.py\r',
        fileName:'user_code.py'
    },
    javascript:{
        image:'node:20-slim',
        shell:'bash',
        Compilecmd:'node user_code.js\r',
        fileName:'user_code.js'
    },
//     react: {
//     image: 'node:20-bookworm-slim',
//     shell: 'bash',
//     isProject: true, // This tells your backend: "Wait, this needs more than one file!"
//     port: 5174,      // The port Vite uses
//     compileCmd: 'npm install && npm run dev -- --host\r',
//     fileName: 'src/App.jsx'
// }

       react:{
        image:'react-base-image',//new custom image
        shell:'bash',
        port:5174,
        // 1. Create a link from the base modules to the current folder
        // 2. Start Vite immediately (NO npm install needed!)
        Compilecmd:'ln -s /base/node_modules /app/node_modules && npm run dev -- --host --port 5174\r',
        fileName:'src/App.jsx'
       },
       node: {
    image: 'node:20-alpine', // Light-weight Node image
    shell: 'sh',
    port: 8081, // Use a different port than your main server
    // Command to link modules and start with watch mode
    Compilecmd: 'ln -s /base/node_modules /app/node_modules && node --watch index.js\r',
    fileName: 'index.js'
    }
}
   