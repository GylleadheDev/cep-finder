"use client";

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createContext, useContext, useEffect, useState } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    if (saved === "dark" || saved === "light") {
      setTheme(saved)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
