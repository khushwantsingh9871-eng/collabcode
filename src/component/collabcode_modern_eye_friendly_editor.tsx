import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  FilePlus,
  FolderPlus,
  Play,
  RotateCcw,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Files,
  Search,
  GitBranch,
  Settings,
  Users,
  Share2,
  Moon,
  Sun,
  Eye,
  Check,
  X,
  Terminal,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Code2,
  Copy,
  Sliders
} from 'lucide-react';

const INITIAL_FILE_SYSTEM = {
  id: 'root',
  name: 'collab-workspace',
  type: 'folder',
  isOpen: true,
  children: [
    {
      id: 'folder-src',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'file-main',
          name: 'index.js',
          type: 'file',
          language: 'javascript',
          content: `// CollabCode - Eye-friendly JavaScript Workspace
// Try running this with Cmd/Ctrl + Enter or click "Run Code"

let a = 15;
let b = 25;

console.log("Welcome to CollabCode Editor!");
console.log("Calculating sum: ", a + " + " + b + " = " + (a + b));

// Sample data processing
const members = [
  { name: "Dev Alpha", role: "Frontend", status: "Active" },
  { name: "Dev Beta", role: "Systems", status: "Reviewing" },
  { name: "Dev Gamma", role: "Design", status: "Collaborating" }
];

console.log("Current team active in session:");
members.forEach((m, idx) => {
  console.log(\`  [\${idx + 1}] \${m.name} (\${m.role}) - \${m.status}\`);
});

function calculateMetrics(items) {
  const total = items.length;
  return { activeSessions: total, ping: "24ms", memory: "18.4 MB" };
}

console.log("Environment Diagnostics:", calculateMetrics(members));
`
        },
        {
          id: 'file-math',
          name: 'algorithms.js',
          type: 'file',
          language: 'javascript',
          content: `// Algorithm Playground: Fibonacci & Prime numbers
function fibonacci(n) {
  let seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

console.log("Fibonacci (first 10 numbers):", fibonacci(10));

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].filter(isPrime);
console.log("Verified Primes:", primes);
`
        },
        {
          id: 'folder-comp',
          name: 'components',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: 'file-button',
              name: 'Button.jsx',
              type: 'file',
              language: 'javascript',
              content: `import React from 'react';

export const GlowingButton = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200"
    >
      {label}
    </button>
  );
};

console.log("Loaded component: GlowingButton");
`
            }
          ]
        }
      ]
    },
    {
      id: 'file-package',
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: `{\n  "name": "collabcode-editor",\n  "version": "2.4.0",\n  "private": true,\n  "dependencies": {\n    "lucide-react": "^0.380.0",\n    "react": "^18.3.0"\n  }\n}`
    },
    {
      id: 'file-readme',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# CollabCode Editor

An ergonomic, eye-friendly coding studio tailored for developers who spend hours writing logic.
Inspired by sleek navy/slate dark dashboards.

### Features
- Deep soothing background tones (#0a0e1a)
- Zero-glare soft pastel code highlight
- Built-in live JS execution terminal
- Multi-file tree manager & tab navigation
`
    }
  ]
};

const THEMES = {
  navy: {
    id: 'navy',
    name: 'Deep Navy (CollabCode)',
    bgDark: '#080c16',
    bgSidebar: '#0b1020',
    bgEditor: '#0d1326',
    border: '#1b243e',
    accent: '#4f6bf7',
    accentGlow: 'rgba(79, 107, 247, 0.25)',
    card: '#121a33'
  },
  slate: {
    id: 'slate',
    name: 'Midnight Slate',
    bgDark: '#090d14',
    bgSidebar: '#0e1420',
    bgEditor: '#111827',
    border: '#1f293d',
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.25)',
    card: '#161f33'
  },
  amoled: {
    id: 'amoled',
    name: 'Pure Onyx (AMOLED)',
    bgDark: '#020408',
    bgSidebar: '#05070e',
    bgEditor: '#070a12',
    border: '#141824',
    accent: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.2)',
    card: '#0a0e19'
  }
};

const findFileById = (node, id) => {
  if (node.id === id && node.type === 'file') return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findFileById(child, id);
      if (found) return found;
    }
  }
  return null;
};

const updateFileContent = (node, id, newContent) => {
  if (node.id === id) {
    return { ...node, content: newContent };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => updateFileContent(child, id, newContent))
    };
  }
  return node;
};

const toggleFolder = (node, folderId) => {
  if (node.id === folderId) {
    return { ...node, isOpen: !node.isOpen };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => toggleFolder(child, folderId))
    };
  }
  return node;
};

const addNodeToFolder = (node, targetFolderId, newNode) => {
  if (node.id === targetFolderId && node.type === 'folder') {
    return {
      ...node,
      isOpen: true,
      children: [...(node.children || []), newNode]
    };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => addNodeToFolder(child, targetFolderId, newNode))
    };
  }
  return node;
};

const deleteNodeById = (node, idToDelete) => {
  if (!node.children) return node;
  return {
    ...node,
    children: node.children
      .filter((child) => child.id !== idToDelete)
      .map((child) => deleteNodeById(child, idToDelete))
  };
};

export default function App() {
  const [fileSystem, setFileSystem] = useState(INITIAL_FILE_SYSTEM);
  const [activeFileId, setActiveFileId] = useState('file-main');
  const [openTabs, setOpenTabs] = useState(['file-main', 'file-math', 'file-package']);
  const [activeLeftTab, setActiveLeftTab] = useState('explorer'); // 'explorer', 'search', 'git', 'settings'
  const [showConsole, setShowConsole] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'system', text: 'CollabCode Runtime ready. Node 18.x v8 engine simulation active.', time: '10:00:00 AM' }
  ]);
  const [executionStatus, setExecutionStatus] = useState({ success: true, time: '0ms' });

  // Eye comfort settings
  const [themeKey, setThemeKey] = useState('navy');
  const [blueLightFilter, setBlueLightFilter] = useState(15); // warmth 0 - 60%
  const [screenBrightness, setScreenBrightness] = useState(98); // 80 - 100%
  const [fontSize, setFontSize] = useState(14.5);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState({ isOpen: false, type: 'file', parentId: 'root' });
  const [newEntityName, setNewEntityName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTheme = THEMES[themeKey];
  const activeFile = useMemo(() => findFileById(fileSystem, activeFileId), [fileSystem, activeFileId]);

  const runCode = () => {
    if (!activeFile) return;
    const start = performance.now();
    const logs = [];

    // Custom console capturer
    const customConsole = {
      log: (...args) => {
        logs.push({
          type: 'log',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      },
      warn: (...args) => {
        logs.push({
          type: 'warn',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      },
      error: (...args) => {
        logs.push({
          type: 'error',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      }
    };

    try {
      // Safe execution sandbox
      const executor = new Function('console', activeFile.content);
      executor(customConsole);
      const elapsed = (performance.now() - start).toFixed(1);

      setExecutionStatus({ success: true, time: `${elapsed}ms` });
      if (logs.length === 0) {
        logs.push({
          type: 'system',
          text: 'Code executed smoothly with no console outputs.',
          time: new Date().toLocaleTimeString()
        });
      }
      setConsoleLogs(logs);
      setShowConsole(true);
    } catch (err) {
      const elapsed = (performance.now() - start).toFixed(1);
      setExecutionStatus({ success: false, time: `${elapsed}ms` });
      logs.push({
        type: 'error',
        text: `${err.name}: ${err.message}`,
        time: new Date().toLocaleTimeString()
      });
      setConsoleLogs(logs);
      setShowConsole(true);
    }
  };

  // Keyboard shortcut listener: Cmd/Ctrl + Enter to run
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile]);

  const handleSelectFile = (file) => {
    setActiveFileId(file.id);
    if (!openTabs.includes(file.id)) {
      setOpenTabs((prev) => [...prev, file.id]);
    }
  };

  const handleCloseTab = (idToClose, e) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((id) => id !== idToClose);
    setOpenTabs(newTabs);
    if (activeFileId === idToClose && newTabs.length > 0) {
      setActiveFileId(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveFileId(null);
    }
  };

  const handleCreateNode = () => {
    if (!newEntityName.trim()) return;
    const newNode = {
      id: `${showNewModal.type}-${Date.now()}`,
      name: newEntityName.trim(),
      type: showNewModal.type,
      ...(showNewModal.type === 'file'
        ? {
            language: newEntityName.endsWith('.json') ? 'json' : 'javascript',
            content: `// ${newEntityName}\nconsole.log("Created ${newEntityName}");\n`
          }
        : {
            isOpen: true,
            children: []
          })
    };

    setFileSystem((prev) => addNodeToFolder(prev, showNewModal.parentId, newNode));
    if (newNode.type === 'file') {
      handleSelectFile(newNode);
    }
    setShowNewModal({ isOpen: false, type: 'file', parentId: 'root' });
    setNewEntityName('');
  };

  const handleDeleteNode = (nodeId, e) => {
    e.stopPropagation();
    setFileSystem((prev) => deleteNodeById(prev, nodeId));
    setOpenTabs((prev) => prev.filter((id) => id !== nodeId));
    if (activeFileId === nodeId) {
      const remaining = openTabs.filter((id) => id !== nodeId);
      setActiveFileId(remaining[0] || null);
    }
  };

  const renderFileIcon = (fileName) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (fileName.endsWith('.md')) {
      return <FileText className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const renderTree = (node, depth = 0) => {
    if (node.type === 'folder') {
      if (node.id === 'root') {
        return (
          <div key={node.id} className="space-y-0.5">
            {node.children && node.children.map((child) => renderTree(child, depth))}
          </div>
        );
      }

      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => setFileSystem((prev) => toggleFolder(prev, node.id))}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className="flex items-center justify-between group py-1.5 pr-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] cursor-pointer text-xs transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              {node.isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 text-indigo-400" />
              ) : (
                <Folder className="w-4 h-4 text-indigo-400" />
              )}
              <span className="font-medium tracking-wide truncate">{node.name}</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
              <button
                title="New File Inside"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNewModal({ isOpen: true, type: 'file', parentId: node.id });
                }}
                className="p-1 hover:text-cyan-400 text-slate-400 rounded transition"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                title="Delete Folder"
                onClick={(e) => handleDeleteNode(node.id, e)}
                className="p-1 hover:text-rose-400 text-slate-400 rounded transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {node.isOpen && node.children && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = activeFileId === node.id;
    return (
      <div
        key={node.id}
        onClick={() => handleSelectFile(node)}
        style={{ paddingLeft: `${depth * 14 + 16}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs cursor-pointer transition-all duration-150 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-transparent text-indigo-200 border-l-2 border-indigo-400 font-medium'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {renderFileIcon(node.name)}
          <span className="truncate">{node.name}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center">
          <button
            title="Delete File"
            onClick={(e) => handleDeleteNode(node.id, e)}
            className="p-1 hover:text-rose-400 text-slate-500 rounded transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const lineCount = useMemo(() => {
    if (!activeFile) return 1;
    return activeFile.content.split('\n').length;
  }, [activeFile]);

  return (
    <div
      className="flex flex-col h-screen w-full select-none overflow-hidden font-sans transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.bgDark,
        color: '#e2e8f0',
        filter: `brightness(${screenBrightness}%)`
      }}
    >
      {/* Eye Comfort Ambient Filter Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          backgroundColor: '#ff9800',
          opacity: blueLightFilter * 0.0035,
          mixBlendMode: 'multiply'
        }}
      />

      {}
      <header
        className="flex items-center justify-between px-4 py-2.5 border-b backdrop-blur-md shrink-0"
        style={{
          backgroundColor: currentTheme.bgSidebar,
          borderColor: currentTheme.border
        }}
      >
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-md shadow-indigo-500/30 text-white font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">CollabCode</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Studio
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>collab-workspace</span>
              <span>/</span>
              <span className="text-slate-300">{activeFile ? activeFile.name : 'No file open'}</span>
            </div>
          </div>
        </div>

        {/* Center / Run Action & Collaboration indicators */}
        <div className="flex items-center gap-3">
          <button
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 transition-all duration-150"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
            <span className="text-[10px] opacity-75 hidden sm:inline ml-0.5 bg-black/20 px-1 py-0.5 rounded">
              ⌘ Enter
            </span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* Active Collaborators Avatars */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.05]">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-slate-900">
                D
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-slate-900">
                A
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-rose-400 flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-slate-900">
                G
              </div>
            </div>
            <span className="text-[11px] text-slate-300 ml-1.5 font-medium">3 Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
        </div>

        {/* Right Eyecare & Preferences Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Eye Comfort Toggle */}
          <button
            onClick={() => setBlueLightFilter((prev) => (prev > 0 ? 0 : 25))}
            title={blueLightFilter > 0 ? 'Disable Night Eye Shield' : 'Enable Warm Night Eye Shield'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              blueLightFilter > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 border-white/[0.08] hover:bg-white/[0.04]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{blueLightFilter > 0 ? 'Eye Shield ON' : 'Eye Shield'}</span>
          </button>

          {/* Theme Quick Switch */}
          <button
            onClick={() => {
              const keys = Object.keys(THEMES);
              const nextIndex = (keys.indexOf(themeKey) + 1) % keys.length;
              setThemeKey(keys[nextIndex]);
            }}
            title={`Switch Theme (Current: ${currentTheme.name})`}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.05] transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.05] transition"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              D
            </div>
            <span className="text-xs text-slate-300 font-medium hidden lg:inline">Developer</span>
          </div>
        </div>
      </header>

      {}
      <div className="flex flex-1 overflow-hidden">
        {/* Leftmost Ultra-Slim Activity Icon Bar */}
        <aside
          className="w-12 border-r flex flex-col items-center py-3 justify-between shrink-0 select-none z-10"
          style={{
            backgroundColor: currentTheme.bgDark,
            borderColor: currentTheme.border
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setActiveLeftTab(activeLeftTab === 'explorer' ? '' : 'explorer')}
              title="File Explorer"
              className={`p-2.5 rounded-xl transition-all ${
                activeLeftTab === 'explorer'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              <Files className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveLeftTab(activeLeftTab === 'search' ? '' : 'search')}
              title="Search Workspace"
              className={`p-2.5 rounded-xl transition-all ${
                activeLeftTab === 'search'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveLeftTab(activeLeftTab === 'git' ? '' : 'git')}
              title="Source Control"
              className={`p-2.5 rounded-xl transition-all ${
                activeLeftTab === 'git'
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              title="Comfort & Editor Settings"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Expandable Sidebar: File Explorer / Search / Git */}
        {activeLeftTab !== '' && (
          <aside
            className="w-64 border-r flex flex-col shrink-0 select-none overflow-hidden transition-all duration-200"
            style={{
              backgroundColor: currentTheme.bgSidebar,
              borderColor: currentTheme.border
            }}
          >
            {activeLeftTab === 'explorer' && (
              <div className="flex flex-col h-full">
                {/* Explorer Header */}
                <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/[0.05]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Explorer: Workspace
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowNewModal({ isOpen: true, type: 'file', parentId: 'folder-src' })}
                      title="New File in src"
                      className="p-1 hover:text-cyan-400 text-slate-400 rounded transition"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowNewModal({ isOpen: true, type: 'folder', parentId: 'root' })}
                      title="New Folder"
                      className="p-1 hover:text-indigo-400 text-slate-400 rounded transition"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tree View list */}
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                  {renderTree(fileSystem)}
                </div>

                {/* Bottom Quick Workspace summary */}
                <div
                  className="p-3 m-2.5 rounded-xl border flex flex-col gap-1.5"
                  style={{
                    backgroundColor: currentTheme.card,
                    borderColor: currentTheme.border
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Eye Care Mode</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Tuned with soft indigo contrasts and blue-light moderation to prevent fatigue.
                  </p>
                </div>
              </div>
            )}

            {activeLeftTab === 'search' && (
              <div className="flex flex-col h-full p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Search In Files
                </span>
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="text-xs text-slate-400 p-2 text-center">
                  {searchQuery ? `Searching for "${searchQuery}"...` : 'Enter query above'}
                </div>
              </div>
            )}

            {activeLeftTab === 'git' && (
              <div className="flex flex-col h-full p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Source Control
                </span>
                <div className="text-xs text-slate-400 bg-white/[0.03] p-3 rounded-lg border border-white/[0.06] mb-3">
                  <div className="flex items-center gap-2 text-slate-200 font-medium mb-1">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                    <span>branch: main</span>
                  </div>
                  <p className="text-[11px] text-slate-400">All changes synchronized with CollabCode cloud.</p>
                </div>
              </div>
            )}
          </aside>
        )}

        {}
        <main
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          style={{ backgroundColor: currentTheme.bgEditor }}
        >
          {/* File Tabs Navigation Bar */}
          <div
            className="flex items-center overflow-x-auto border-b border-white/[0.05] custom-scrollbar select-none"
            style={{ backgroundColor: currentTheme.bgDark }}
          >
            {openTabs.map((tabId) => {
              const fileObj = findFileById(fileSystem, tabId);
              if (!fileObj) return null;
              const isActive = activeFileId === tabId;

              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`group flex items-center gap-2 px-3.5 py-2 text-xs border-r transition-all cursor-pointer border-white/[0.06] ${
                    isActive
                      ? 'bg-gradient-to-t from-indigo-950/40 to-transparent text-indigo-300 font-medium border-b-2 border-b-indigo-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.bgEditor : 'transparent'
                  }}
                >
                  {renderFileIcon(fileObj.name)}
                  <span className="truncate max-w-[120px]">{fileObj.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(tabId, e)}
                    className="p-0.5 rounded-full hover:bg-white/[0.1] text-slate-500 hover:text-slate-200 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumb Path Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/[0.04] text-[11px] text-slate-400 bg-white/[0.01]">
            <div className="flex items-center gap-1.5">
              <span>collab-workspace</span>
              <span>/</span>
              <span>src</span>
              <span>/</span>
              <span className="text-slate-200 font-medium">{activeFile ? activeFile.name : 'Untitled'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500">UTF-8</span>
              <span className="text-[10px] text-indigo-400 font-medium uppercase">
                {activeFile?.language || 'plain text'}
              </span>
              <span className="text-[10px] text-slate-500">Lines: {lineCount}</span>
            </div>
          </div>

          {/* Core Code Editor Workspace (Line Gutter + Textarea) */}
          <div className="flex-1 flex overflow-hidden relative">
            {activeFile ? (
              <>
                {/* Line Numbers Gutter */}
                <div
                  className="w-12 py-3 select-none flex flex-col items-end pr-3 border-r border-white/[0.04] text-slate-600 font-mono text-xs overflow-hidden shrink-0"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.65rem',
                    backgroundColor: currentTheme.bgDark
                  }}
                >
                  {Array.from({ length: lineCount }).map((_, idx) => (
                    <span key={idx} className="hover:text-slate-400 transition-colors">
                      {idx + 1}
                    </span>
                  ))}
                </div>

                {/* Primary Code Area */}
                <div className="flex-1 relative overflow-auto custom-scrollbar">
                  <textarea
                    value={activeFile.content}
                    onChange={(e) => {
                      const updated = e.target.value;
                      setFileSystem((prev) => updateFileContent(prev, activeFile.id, updated));
                    }}
                    onKeyDown={(e) => {
                      // Support Tab Indentation in editor
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const target = e.target;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        const val = target.value;
                        const updated = val.substring(0, start) + '  ' + val.substring(end);
                        setFileSystem((prev) => updateFileContent(prev, activeFile.id, updated));
                        setTimeout(() => {
                          target.selectionStart = target.selectionEnd = start + 2;
                        }, 0);
                      }
                    }}
                    spellCheck={false}
                    className="w-full h-full p-3 font-mono outline-none resize-none bg-transparent text-slate-200 placeholder-slate-600 leading-relaxed custom-scrollbar whitespace-pre"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: '1.65rem',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      caretColor: '#818cf8'
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
                <FileCode className="w-12 h-12 mb-3 text-slate-600 stroke-[1.5]" />
                <p>No open file selected.</p>
                <p className="text-xs text-slate-600 mt-1">Select a file from the explorer on the left.</p>
              </div>
            )}
          </div>

          {}
          <div
            className="border-t transition-all duration-200 flex flex-col shrink-0"
            style={{
              height: showConsole ? '190px' : '36px',
              backgroundColor: currentTheme.bgDark,
              borderColor: currentTheme.border
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.04] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Output Terminal</span>
                </button>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    executionStatus.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {executionStatus.success ? `Exit: 0 (${executionStatus.time})` : `Exit: 1 (Error)`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleLogs([])}
                  title="Clear Console"
                  className="p-1 text-slate-400 hover:text-slate-200 rounded transition"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    const text = consoleLogs.map((l) => `[${l.time}] ${l.text}`).join('\n');
                    navigator.clipboard.writeText(text);
                  }}
                  title="Copy Logs"
                  className="p-1 text-slate-400 hover:text-slate-200 rounded transition"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded transition"
                >
                  {showConsole ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Terminal Log Items */}
            {showConsole && (
              <div className="flex-1 p-2.5 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                {consoleLogs.length === 0 ? (
                  <div className="text-slate-600 text-xs italic">Terminal empty. Hit "Run Code" to inspect logs.</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 py-0.5 leading-relaxed ${
                        log.type === 'error'
                          ? 'text-rose-400'
                          : log.type === 'warn'
                          ? 'text-amber-300'
                          : log.type === 'system'
                          ? 'text-indigo-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-600 select-none shrink-0 font-sans mt-0.5">
                        {log.time}
                      </span>
                      <span className="select-none text-slate-500 font-semibold">{'>'}</span>
                      <pre className="whitespace-pre-wrap font-mono flex-1 break-all">{log.text}</pre>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {}
      <footer
        className="flex items-center justify-between px-3 py-1 border-t text-[11px] text-slate-400 shrink-0 select-none"
        style={{
          backgroundColor: currentTheme.bgSidebar,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Collab Sync Connected</span>
          </div>
          <span className="text-slate-600">|</span>
          <span>Theme: {currentTheme.name}</span>
          <span className="text-slate-600">|</span>
          <span>Night Shield: {blueLightFilter}%</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Spaces: 2</span>
          <span className="text-slate-400">Encoding: UTF-8</span>
          <span className="text-indigo-300 font-medium">JavaScript Runtime</span>
        </div>
      </footer>

      {}
      {showNewModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm rounded-2xl border p-4 shadow-2xl flex flex-col gap-3"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Create New {showNewModal.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <button
                onClick={() => setShowNewModal({ isOpen: false, type: 'file', parentId: 'root' })}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNode();
                if (e.key === 'Escape') setShowNewModal({ isOpen: false, type: 'file', parentId: 'root' });
              }}
              placeholder={showNewModal.type === 'file' ? 'e.g. helper.js or styles.css' : 'e.g. assets'}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewModal({ isOpen: false, type: 'file', parentId: 'root' })}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNode}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl border p-5 shadow-2xl flex flex-col gap-4"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Visual Comfort & Editor Settings</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Palette Options */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Editor Palette</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(THEMES).map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => setThemeKey(thm.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition flex flex-col gap-1 ${
                      themeKey === thm.id
                        ? 'border-indigo-400 bg-indigo-500/10 text-indigo-200'
                        : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{thm.name.split(' ')[0]}</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thm.bgDark }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thm.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Blue light Warmth Filter Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Eye Shield (Warm Blue-Light Filter)</span>
                <span className="text-amber-400 font-mono">{blueLightFilter}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={blueLightFilter}
                onChange={(e) => setBlueLightFilter(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Warmer tones significantly reduce melatonin disruption and retina strain during night shifts.
              </p>
            </div>

            {/* Screen Brightness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Display Softness / Brightness</span>
                <span className="text-indigo-400 font-mono">{screenBrightness}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="100"
                value={screenBrightness}
                onChange={(e) => setScreenBrightness(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Code Font Size</span>
                <span className="text-cyan-400 font-mono">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="20"
                step="0.5"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}