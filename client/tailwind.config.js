/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        'custom-black':'#0B0C10',
        'custom-dark-blue':'#1F2833',
        'custom-silver':'#C5C6C7',
        'custom-aquamarine':'#66FCF1',
        'custom-green-blue':'#45A29E',
      }
    },
  },  
  plugins: [],
}