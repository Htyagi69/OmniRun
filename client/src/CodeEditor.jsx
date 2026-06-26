import React, { useEffect, useRef, useState, useCallback } from 'react'
import Editor from '@monaco-editor/react';
import { StarterCode } from './constants'

function CodeEditor({ socket, isClicked, lang ,editorWidth,setEditorWidth,activeTerminalId}) {
  const EditorRef = useRef(null);
  const [codex, setCodex] = useState();
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handleEditorMount = (editor) => {
    EditorRef.current = editor;
  }

  useEffect(() => {
    if (isClicked && socket) {
      socket.emit('run-code', { code: codex, language: lang ,targetTerminalId:activeTerminalId});
    }
  }, [isClicked])

  useEffect(() => {
    setCodex(StarterCode[lang]);
  }, [lang])

  // ✅ Drag logic on the divider
  const onMouseDown = useCallback(() => {
    isDragging.current = true;

    const onMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - container.left) / container.width) * 100;
      // Clamp between 20% and 80%
      setEditorWidth(Math.min(100, Math.max(20, newWidth)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
      {/* Editor Panel */}
      <div style={{ width: `${editorWidth}%`, height: '100%', overflow: 'hidden' }} >
        <Editor
          height="87vh"
          width="59.6vw"
          defaultLanguage="cpp"
          value={StarterCode[lang]}
          onChange={(newCode) => {
            setCodex(newCode);
            socket.emit("message", newCode); // ✅ was sending stale codex before
          }}
          theme='vs-dark'
          onMount={handleEditorMount}
        />
      </div>

      {/* ✅ Drag Handle Divider */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width: '5px',
          cursor: 'col-resize',
          background: '#3a3a3a',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.target.style.background = '#60a5fa'}  // blue on hover
        onMouseLeave={e => e.target.style.background = '#3a3a3a'}
      />

      {/* Terminal Panel — takes remaining space */}
      <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
        {/* TerminalBox goes here, or pass width down via props */}
      </div>
    </div>
  );
}

export default CodeEditor