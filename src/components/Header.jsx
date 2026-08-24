import { useRef } from 'react';
import { Download, Moon, Plus, Search, Sun, Ticket, Upload, X } from 'lucide-react';

export default function Header({ search, onSearchChange, theme, onToggleTheme, onAddJob, onExport, onImportFile }) {
  const fileInputRef = useRef(null);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) onImportFile(file);
    e.target.value = '';
  }

  return (
    <header className="border-b border-line-light dark:border-line-dark bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#3B7DED] flex items-center justify-center">
            <Ticket size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-[17px] text-ink-light dark:text-ink-dark hidden sm:inline">
            Trackline QA
          </span>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full rounded-lg border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm text-ink-light dark:text-ink-dark pl-9 pr-8 py-2 placeholder:text-muted-light/70 dark:placeholder:text-muted-dark/70 focus-ring"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <IconButton onClick={handleImportClick} label="Import backup JSON">
            <Upload size={16} />
          </IconButton>
          <IconButton onClick={onExport} label="Export data as JSON">
            <Download size={16} />
          </IconButton>
          <IconButton onClick={onToggleTheme} label="Toggle light / dark mode">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>

          <button
            onClick={() => onAddJob()}
            className="flex items-center gap-1.5 bg-[#3B7DED] text-white text-sm font-medium rounded-lg pl-3 pr-3.5 py-2 hover:bg-[#2f6bd4] focus-ring shadow-sm ml-1"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add job</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-2 rounded-lg text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark hover:text-ink-light dark:hover:text-ink-dark focus-ring"
    >
      {children}
    </button>
  );
}
