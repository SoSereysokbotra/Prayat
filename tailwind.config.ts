import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:               'rgb(var(--color-bg) / <alpha-value>)',
        surface:          'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt':    'rgb(var(--color-surface-alt) / <alpha-value>)',
        text:             'rgb(var(--color-text) / <alpha-value>)',
        muted:            'rgb(var(--color-text-muted) / <alpha-value>)',
        border:           'rgb(var(--color-border) / <alpha-value>)',
        primary:          'rgb(var(--color-primary) / <alpha-value>)',
        'primary-text':   'rgb(var(--color-primary-text) / <alpha-value>)',
        danger:           'rgb(var(--color-danger) / <alpha-value>)',
        safe:             'rgb(var(--color-safe) / <alpha-value>)',
        caution:          'rgb(var(--color-caution) / <alpha-value>)',
        'bubble-scammer': 'rgb(var(--color-bubble-scammer) / <alpha-value>)',
        'bubble-auntie':  'rgb(var(--color-bubble-auntie) / <alpha-value>)',
        'bubble-player':  'rgb(var(--color-bubble-player) / <alpha-value>)',
        'zone-threat':    'rgb(var(--color-zone-threat) / <alpha-value>)',
      },
      borderRadius: {
        card:   'var(--radius-card)',
        bubble: 'var(--radius-bubble)',
        button: 'var(--radius-button)',
      },
      fontFamily: {
        kh: ['var(--font-kh)'],
        en: ['var(--font-en)'],
      },
      fontSize: {
        display: 'var(--text-display)',
        title:   'var(--text-title)',
        body:    'var(--text-body)',
        small:   'var(--text-small)',
        rule:    'var(--text-rule)',
      },
      lineHeight: {
        kh: 'var(--leading-kh)',
        en: 'var(--leading-en)',
      },
      spacing: {
        'screen-x': 'var(--space-screen-x)',
        section:    'var(--space-section)',
        stack:      'var(--space-stack)',
        tap:        'var(--space-tap)',
        icon:       'var(--space-icon)',
        bar:        'var(--space-bar)',
      },
      height: {
        'zone-threat':  'var(--zone-threat-h)',
        'zone-chat':    'var(--zone-chat-h)',
        'zone-options': 'var(--zone-options-h)',
      },
      transitionDuration: {
        'option-fade': 'var(--timing-option-fade)',
        route:         'var(--timing-route)',
      },
    },
  },
  plugins: [],
} satisfies Config
