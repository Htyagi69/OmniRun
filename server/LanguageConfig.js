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
    react: {
    image: 'node:20-bookworm-slim',
    shell: 'bash',
    isProject: true, // This tells your backend: "Wait, this needs more than one file!"
    port: 5174,      // The port Vite uses
    compileCmd: 'npm install && npm run dev -- --host\r',
    fileName: 'src/App.jsx'
}
}
