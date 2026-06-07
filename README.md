# Quantix

Quantix is a lightweight, responsive utility calculator and comprehensive unit converter designed to work natively as a web application, a Google Chrome Extension, or a Mozilla Firefox Add-on.

The application emphasizes offline reliability, standard keyboard and numpad accessibility, and efficient layout scaling across desktop and mobile form factors.

---

## Availability

[![Addons Store](https://raw.githubusercontent.com/Pro-Bandey/Shield-Authenticator/main/src/firefox.webp)](https://addons.mozilla.org/firefox/addon/Quantix/)

---

## Features

### 1. Interactive Core Utilities

- **Calculator**: A standard-precision arithmetic calculator supporting sequential equations, numeric storage states, and automatic floating-point rounding.
- **Age Extractor**: Generates an exact tracking breakdown of age in years, months, and days based on a selected birth date.

### 2. Physical & Scientific Converters

- **Currency Converter**: Connects to dynamic exchange rate services, featuring real-time input filtering and an automated local cache fallback for offline operation.
- **Physical Dimension Converters**: Support for conversions across several unit groups, including:
  - Length / Distance
  - Mass / Weight
  - Temperature
  - Volume
  - Area
  - Speed
  - Time

### 3. Navigation & Usability

- **Accessibility & Keyboard Support**:
  - **Calculator**: Full physical numpad mappings, including `Backspace`, `Enter` (evaluation), and `Delete`/`Escape` (clear/AC).
  - **Shortcuts**: Use the `S` key or `Ctrl + S` sequence globally to trigger unit swaps on any active converter view.
  - **Arrow Keys**: Use `Left`/`Right` or `Up`/`Heigh` arrow keys to switch active panels when focus is not inside an active text input.
- **Manual Theme Overrides**: Seamless switching between Dark and Light mode themes that store preferences and complement native system-level visual preferences.
- **Responsive Layout**: Replaced unstable vendor size classes with dynamic viewports (`100dvh`) to prevent mobile UI clipping from shifting browser address bars.
