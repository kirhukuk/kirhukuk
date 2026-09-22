import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Edit3,
  Code,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { renderRichContent } from '../../utils/renderRichContent';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  { name: 'Varsayılan Açık', hex: '#F1F5F9' },
  { name: 'Altın Sarısı (Vurgu)', hex: '#C5A880' },
  { name: 'Koyu Altın', hex: '#9A7B4F' },
  { name: 'Kırmızı (Önemli)', hex: '#EF4444' },
  { name: 'Yeşil (Onay)', hex: '#10B981' },
  { name: 'Mavi (Bilgi)', hex: '#3B82F6' },
  { name: 'Lacivert', hex: '#1E3A8A' },
  { name: 'Gri (Açıklama)', hex: '#94A3B8' },
  { name: 'Mor', hex: '#8B5CF6' }
];

const PRESET_FONTS = [
  { name: 'Times New Roman (Klasik Hukuk)', value: "'Times New Roman', Times, serif" },
  { name: 'Georgia (Zarif Serif)', value: 'Georgia, serif' },
  { name: 'Garamond (Resmi Dilekçe)', value: 'Garamond, serif' },
  { name: 'Arial (Modern Sans)', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Tahoma (Okunaklı)', value: 'Tahoma, Verdana, sans-serif' },
  { name: 'Courier New (Daktilo / Karar)', value: "'Courier New', Courier, monospace" }
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçeriğinizi buraya yazın veya biçimlendirin...'
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#C5A880');

  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef(false);

  // Sync external value to visual editor when value changes outside
  useEffect(() => {
    if (editorRef.current && activeTab === 'visual') {
      const currentHtml = editorRef.current.innerHTML;
      if (!isInternalChangeRef.current && value !== currentHtml) {
        editorRef.current.innerHTML = value || '';
      }
      isInternalChangeRef.current = false;
    }
  }, [value, activeTab]);

  // Execute formatting command on contentEditable
  const executeCommand = (command: string, valueArgument: string | undefined = undefined) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArgument);
    handleEditorInput();
  };

  // On input event in contentEditable
  const handleEditorInput = () => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Color formatting
  const handleApplyColor = (colorHex: string) => {
    setSelectedColor(colorHex);
    executeCommand('foreColor', colorHex);
    setShowColorMenu(false);
  };

  // Font family formatting
  const handleApplyFont = (fontFamily: string) => {
    executeCommand('fontName', fontFamily);
    setShowFontMenu(false);
  };

  // Block format (H1, H2, H3, P, Blockquote)
  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  // Link insertion
  const handleInsertLink = () => {
    const url = prompt('Bağlantı URL adresini giriniz (Örn: https://example.com):', 'https://');
    if (url && url.trim()) {
      executeCommand('createLink', url.trim());
    }
  };

  // Image insertion
  const handleInsertImage = () => {
    const url = prompt(
      'Görsel bağlantısı URL adresini giriniz:',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    );
    if (url && url.trim()) {
      executeCommand('insertImage', url.trim());
    }
  };

  // Table insertion
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid rgba(255,255,255,0.2);">
        <thead>
          <tr style="background: rgba(197, 168, 128, 0.2);">
            <th style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; text-align: left;">Başlık 1</th>
            <th style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; text-align: left;">Başlık 2</th>
            <th style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; text-align: left;">Başlık 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 1</td>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 2</td>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 4</td>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 5</td>
            <td style="border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px;">Metin 6</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  // Prevent button clicks from unfocusing the editable text
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative border border-white/15 rounded-xl overflow-hidden bg-[#1C2E4A] flex flex-col shadow-lg">
      {/* Click outside overlay for popovers */}
      {(showColorMenu || showFontMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowColorMenu(false);
            setShowFontMenu(false);
          }}
        />
      )}

      {/* Main Toolbar */}
      <div className="bg-[#0B132B] p-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Left Formatting Buttons (Active in Visual mode) */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Font Selection Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={preventFocusLoss}
              onClick={() => {
                setShowFontMenu(!showFontMenu);
                setShowColorMenu(false);
              }}
              disabled={activeTab !== 'visual'}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white text-xs flex items-center gap-1.5 border border-white/10 disabled:opacity-40"
              title="Yazı Tipi (Font)"
            >
              <Type className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Yazı Tipi</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showFontMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#0B132B] border border-white/20 rounded-lg shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in">
                <div className="text-[10px] text-slate-400 px-2 py-1 font-semibold uppercase tracking-wider border-b border-white/10">
                  Yazı Tipi Seçin
                </div>
                {PRESET_FONTS.map(font => (
                  <button
                    key={font.name}
                    type="button"
                    onMouseDown={preventFocusLoss}
                    onClick={() => handleApplyFont(font.value)}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:text-[#C5A880] hover:bg-white/10 rounded flex items-center justify-between transition-colors"
                    style={{ fontFamily: font.value }}
                  >
                    <span>{font.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Selection Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={preventFocusLoss}
              onClick={() => {
                setShowColorMenu(!showColorMenu);
                setShowFontMenu(false);
              }}
              disabled={activeTab !== 'visual'}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white text-xs flex items-center gap-1.5 border border-white/10 disabled:opacity-40"
              title="Metin Rengi"
            >
              <Palette className="w-3.5 h-3.5 text-[#C5A880]" />
              <span
                className="w-3 h-3 rounded-full border border-white/30 inline-block"
                style={{ backgroundColor: selectedColor }}
              />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showColorMenu && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0B132B] border border-white/20 rounded-lg shadow-2xl p-2 z-50 space-y-1.5 animate-in fade-in">
                <div className="text-[10px] text-slate-400 px-1 font-semibold uppercase tracking-wider border-b border-white/10 pb-1">
                  Yazı Rengi Seçin
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color.hex}
                      type="button"
                      onMouseDown={preventFocusLoss}
                      onClick={() => handleApplyColor(color.hex)}
                      className="p-1.5 rounded hover:bg-white/10 flex flex-col items-center gap-1 text-[10px] text-slate-300 hover:text-white"
                      title={color.name}
                    >
                      <span
                        className="w-5 h-5 rounded-md border border-white/30 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="truncate w-full text-center">{color.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

          {/* Bold, Italic, Underline, Strikethrough */}
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('bold')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40 font-bold"
            title="Kalın (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('italic')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40 italic"
            title="İtalik (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('underline')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Altı Çizili (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('strikeThrough')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Üstü Çizili (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

          {/* Alignments (Left, Center, Right, Justify) - Live visual alignment! */}
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('justifyLeft')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Sola Hizala"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('justifyCenter')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Ortala (Center)"
          >
            <AlignCenter className="w-4 h-4 text-[#C5A880]" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('justifyRight')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Sağa Hizala"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('justifyFull')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="İki Yana Yasla (Justify)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

          {/* Headings */}
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => handleFormatBlock('<h1>')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40 font-bold text-xs"
            title="Ana Başlık (H1)"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => handleFormatBlock('<h2>')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40 font-bold text-xs"
            title="Alt Başlık (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => handleFormatBlock('<h3>')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40 font-bold text-xs"
            title="Küçük Başlık (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

          {/* Lists & Quote */}
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('insertUnorderedList')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Maddeli Liste"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('insertOrderedList')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Numaralı Liste"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => handleFormatBlock('<blockquote>')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Alıntı Kutusu (Quote)"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => executeCommand('insertHorizontalRule')}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Ayraç Çizgi (Horizontal Line)"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

          {/* Link, Image & Table */}
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={handleInsertLink}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Bağlantı (Link) Ekle"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={handleInsertImage}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Görsel Ekle"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={handleInsertTable}
            disabled={activeTab !== 'visual'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white disabled:opacity-40"
            title="Tablo Ekle"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right View Modes Toggle: Görsel Düzenleyici | HTML Kodu | Önizleme */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('visual');
              setShowColorMenu(false);
              setShowFontMenu(false);
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#C5A880] text-[#0B132B] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Görsel WYSIWYG Düzenleyici (Kodsuz, Doğrudan Biçimlendirme)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Görsel Düzenleyici</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('code');
              setShowColorMenu(false);
              setShowFontMenu(false);
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#C5A880] text-[#0B132B] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="HTML / Kaynak Kodu Görünümü"
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Kodu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('preview');
              setShowColorMenu(false);
              setShowFontMenu(false);
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#C5A880] text-[#0B132B] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Canlı Yayın Önizlemesi"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Canlı Önizle</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'visual' && (
        <div className="relative min-h-[360px] bg-[#0F172A] p-5 text-slate-100 focus-within:ring-1 focus-within:ring-[#C5A880]/50">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            data-placeholder={placeholder}
            className="outline-none min-h-[320px] text-sm leading-relaxed max-w-none text-slate-100 selection:bg-[#C5A880]/40 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500 empty:before:pointer-events-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#C5A880] [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-200 [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#C5A880] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:bg-white/5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/20 [&_th]:p-2 [&_td]:border [&_td]:border-white/20 [&_td]:p-2"
          />
        </div>
      )}

      {activeTab === 'code' && (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={15}
          className="w-full p-4 bg-[#0B132B] text-amber-200 font-mono text-xs leading-relaxed focus:outline-none resize-y"
        />
      )}

      {activeTab === 'preview' && (
        <div
          className="p-6 min-h-[360px] overflow-y-auto max-w-none text-slate-200 bg-[#0F172A]"
          dangerouslySetInnerHTML={{ __html: renderRichContent(value, { theme: 'dark' }) }}
        />
      )}

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-[#0B132B] border-t border-white/10 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#C5A880]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Görsel Düzenleyici Aktif: Kalın, renkli ve ortalı metinler doğrudan ekranda biçimlendirilir.</span>
        </div>
        <span className="text-slate-400 font-mono">{value.length} karakter</span>
      </div>
    </div>
  );
};
