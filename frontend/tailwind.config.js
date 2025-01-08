/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ["Montserrat", 'Helvetica', 'Arial', 'sans-serif'],
      "input": ["Coming Soon"]
    },
    extend: {
      keyframes: {
        scrollDots: {
          "0%": { backgroundPosition: '0 0' },
          "100%": { backgroundPosition: '-30px 30px' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(0.75)' },
          '50%': { transform: 'scale(0.8)' },
        },
        slideFromLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideFromRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideToRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        slideToBottom: {
          "0%": { transform: "translateY(-25%)" },
          "100%": { transform: "translateY(100%)" }
        },
        slideFromTop: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
        slideInTop: {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-100vw - 50%))" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100vw - 50%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": {opacity: "0"},
          "100%": {opacity: "1"}
        },
        fadeOut: {
          "0%": {opacity: "1"},
          "100%": {opacity: "0"},
        },
        fadeFromRight: {
          "0%": { transform: "translateX(0%)", opacity: "0" },
          "25%, 75%": { opacity: "1" },
          "100%": { transform: "translateX(-50%)", opacity: "0" },
        },
        slideFromMidToBottom: {
          "0%": { transform: "translateY(calc(-50vh + 4rem))" },
          "100%": { transform: "translateY(0%)" },
        },
        shake: {
          "20%": { transform: "translateX(10%)" },
          "40%": { transform: "translateX(-10%)" },
          "60%": { transform: "translateX(10%)" },
          "80%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(0%)" },
        },
        scaleSpike: {
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1.0)" }
        },
        slowFadeOut: {
          "70%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        overshootFromLeft: {
          "0%": { transform: "translateX(-100vw)" },
          "80%": { transform: "translateX(50px)" },
          "100%": { transform: "translateX(0)" }
        }
      },
      animation: {
        "scroll-dots": "scrollDots 2s linear infinite",
        "pulse-scale": "pulseScale 5s ease-in-out infinite",
        "slide-from-left": "slideFromLeft 0.5s ease-out forwards",
        "slide-from-right": "slideFromRight 0.5s ease-out forwards",
        "slide-to-right": "slideToRight 0.5s linear forwards",
        "fade-in": "fadeIn 0.2s ease-out, forwards",
        "fade-out": "fadeOut 0.2s ease-out, forwards",
        "fade-from-right": "fadeFromRight 3s linear forwards",
        "slide-from-top": "slideFromTop 0.5s ease-out forwards",
        "slide-to-top": "slideToTop 0.5s linear forwards",
        "slide-from-mid-to-bottom": "slideFromMidToBottom 0.5s ease-out forwards",
        "slide-out-top": "slideOutTop 0.2s linear forwards",
        "slide-in-top": "slideInTop 0.2s ease-out forwards",
        "slide-out-left": "slideOutLeft 0.2s linear forwards",
        "slide-in-left": "slideInLeft 0.2s ease-out forwards",
        "slide-to-bottom": "slideToBottom 0.5s linear forwards",
        "shake": "shake 0.2s linear forwards",
        "scale-spike": "scaleSpike 0.2s linear forwards",
        "slow-fade-out": "slowFadeOut 5s linear forwards",
        "slow-fade-in": "fadeIn 2s ease-out forwards",
        "overshoot-from-left": "overshootFromLeft 0.7s ease-out forwards"
      },
    },
  },
  plugins: [],
}

