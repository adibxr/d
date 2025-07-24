"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="relative w-9 h-9 overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ x: -20, opacity: 0, rotate: -90 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute"
        >
          {isDark ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
