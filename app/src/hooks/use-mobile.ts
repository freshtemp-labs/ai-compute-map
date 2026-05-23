/**
 * @file use-mobile.ts
 * @description 移动端视口检测 Hook。监听窗口宽度变化，判断是否为移动端（< 768px）。
 * @dependencies react
 */

import * as React from "react"

/** 移动端断点宽度（px），小于此值视为移动设备 */
const MOBILE_BREAKPOINT = 768

/**
 * 判断当前视口是否为移动端尺寸
 * @returns {boolean} 若视口宽度 < 768px 返回 true，初始加载时返回 false
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
