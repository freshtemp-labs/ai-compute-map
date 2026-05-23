/**
 * @file components/developers/CodeBlock.tsx
 * @description 基于 Prism.js 的语法高亮代码块组件。
 *   支持 bash/typescript/javascript/python/go/rust/json/yaml 八种语言。
 *   自带一键复制按钮（带动画反馈），仿 macOS 窗口样式。
 * @dependencies react-syntax-highlighter, framer-motion, lucide-react
 */
import { useState, useCallback } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** 注册 Prism 语言支持 */
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);

/** CodeBlock 组件 Props */
interface CodeBlockProps {
  /** 代码文本 */
  code: string;
  /** 编程语言标识 */
  language: string;
  /** 文件名（显示在标题栏） */
  filename?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
}

/** 自定义 One Dark 主题，适配暗色背景 */
const customOneDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#111118',
    margin: 0,
    borderRadius: '0 0 8px 8px',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: '"JetBrains Mono", Menlo, monospace',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: '"JetBrains Mono", Menlo, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
  },
};

/**
 * 语法高亮代码块组件
 * 使用 Prism.js 进行语法着色，提供一键复制功能
 * @param code - 代码文本
 * @param language - 编程语言
 * @param filename - 文件名（可选，显示在标题栏）
 * @param showLineNumbers - 是否显示行号
 * @returns 代码块组件
 */
export default function CodeBlock({ code, language, filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const displayLang = language === 'bash' ? 'bash'
    : language === 'typescript' ? 'TypeScript'
    : language === 'javascript' ? 'JavaScript'
    : language === 'python' ? 'Python'
    : language === 'go' ? 'Go'
    : language === 'rust' ? 'Rust'
    : language === 'json' ? 'JSON'
    : language;

  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden bg-bg-elevated">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          {filename && (
            <span className="text-mono-sm text-text-muted ml-2">{filename}</span>
          )}
          <span className="text-mono-sm text-text-muted">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-mono-sm text-text-muted hover:text-text-primary hover:bg-border-active transition-all duration-200"
          aria-label="Copy to clipboard"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-success"
              >
                <Check size={14} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Copy size={14} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={customOneDark}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{
          color: '#6B6B80',
          fontSize: '12px',
          paddingRight: '16px',
          minWidth: '40px',
        }}
        customStyle={{
          background: '#111118',
          padding: '20px 16px',
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
