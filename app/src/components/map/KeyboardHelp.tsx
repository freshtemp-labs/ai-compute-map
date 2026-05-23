/**
 * @file KeyboardHelp.tsx
 * @description Keyboard shortcuts help dialog showing available map navigation shortcuts.
 *
 * @dependencies framer-motion, react-i18next
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * KeyboardHelp 组件属性
 */
interface KeyboardHelpProps {
  /** 对话框是否打开 */
  isOpen: boolean;
  /** 关闭对话框回调 */
  onClose: () => void;
}

/**
 * 键盘快捷键帮助对话框
 * 显示地图导航可用的键盘快捷键列表
 * @param isOpen - 对话框是否打开
 * @param onClose - 关闭回调
 * @returns 快捷键帮助对话框 JSX 元素
 */
export default function KeyboardHelp({ isOpen, onClose }: KeyboardHelpProps) {
  const { t } = useTranslation('map');
  const shortcuts = [
    { keys: ['?'], description: t('map:keyboard.showHelp') },
    { keys: ['1'], description: t('map:keyboard.layer1') },
    { keys: ['2'], description: t('map:keyboard.layer2') },
    { keys: ['3'], description: t('map:keyboard.layer3') },
    { keys: ['+'], description: t('map:keyboard.zoomIn') },
    { keys: ['-'], description: t('map:keyboard.zoomOut') },
    { keys: ['0'], description: t('map:keyboard.reset') },
    { keys: ['Esc'], description: t('map:keyboard.close') },
    { keys: ['Cmd', 'K'], description: t('map:keyboard.search') },
  ];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] px-4 z-[71]"
          >
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E28]">
                <h3 className="text-heading-sm text-[#E8E8EC] font-display">{t('map:keyboard.title')}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-[#6B6B80] hover:text-[#E8E8EC] hover:bg-[#181820] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {shortcuts.map(({ keys, description }) => (
                  <div key={description} className="flex items-center justify-between gap-4">
                    <span className="text-body-sm text-[#9A9AAF]">{description}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {keys.map((key, i) => (
                            <span key={key} className="flex items-center gap-1">
                              {i > 0 && <span className="text-[#6B6B80] text-[10px]">+</span>}
                              <kbd className="text-[11px] font-mono text-[#E8E8EC] bg-[#181820] px-1.5 py-0.5 rounded border border-[#1E1E28] min-w-[24px] text-center">
                                {key}
                              </kbd>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
