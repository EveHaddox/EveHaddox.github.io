module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1A1A1A',
        header:     '#242424',
        scroller:   '#383838',
        primary:    '#B43A3A',
        positive:   '#46AF46',
        negative:   '#BE4141',
        gold:       '#D6AE22',
        silver:     '#C0C0C0',
        bronze:     '#915E31',
        text: {
          DEFAULT:  '#F0F0F0',
          muted:    '#C8C8C8',
          disabled: '#646464',
        },
      },
      borderRadius: {
        sm: '4px',  // Elib.Scale(4)
        md: '6px',  // Elib.Scale(6)
      },
    },
  },
  plugins: [],
};