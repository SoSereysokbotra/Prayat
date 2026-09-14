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

        'chrome-sms':      'rgb(var(--color-chrome-sms) / <alpha-value>)',
        'chrome-telegram': 'rgb(var(--color-chrome-telegram) / <alpha-value>)',
        'chrome-facebook': 'rgb(var(--color-chrome-facebook) / <alpha-value>)',
        'chrome-browser':  'rgb(var(--color-chrome-browser) / <alpha-value>)',
        'chrome-receipt':  'rgb(var(--color-chrome-receipt) / <alpha-value>)',
        'verdict-real':    'rgb(var(--color-verdict-real) / <alpha-value>)',
        'verdict-scam':    'rgb(var(--color-verdict-scam) / <alpha-value>)',
      },
      minHeight: {
        'card-min': 'var(--size-card-min)',
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
        qr:         'var(--size-qr)',
      },
      height: {
        'zone-threat':  'var(--zone-threat-h)',
        'zone-chat':    'var(--zone-chat-h)',
        'zone-options': 'var(--zone-options-h)',
        'chat-pane':    'var(--size-chat-pane)',
        'card-min':     'var(--size-card-min)',
        qr:             'var(--size-qr)',
        'timer-bar':    'var(--space-timer-bar)',
      },
      flexBasis: {
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
