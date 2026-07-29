# ⏱️ Digital Clock - Modern Screensaver & Web Clock

A modern, responsive, high-precision digital clock web application designed for both web browser usage and screensavers (Android & Windows). Features modern typography, OLED burn-in prevention, customizable color themes, 3D parallax tilt, and interactive cosmic dust particles.

---

## ✨ Features

- ⏱️ **High-Precision Timekeeping:** Synchronized to exact system second boundaries with 12-hour (AM/PM) and 24-hour format toggling.
- 🛡️ **OLED & IPS Burn-In Prevention:** Random minute-based pixel shifting (`translate(x, y)` smooth transition every 60 seconds) to protect screens during long screensaver sessions.
- 🎨 **Custom Color Themes:** Minimalist color palette popover + native color picker integration to customize clock accent colors.
- 🌌 **Cosmic Dust Canvas Engine:** Interactive floating particle system rendered on full-screen Canvas with automatic performance throttling.
- 🔋 **Battery & Energy Efficient:** Integrates Page Visibility API (`visibilitychange`) to pause background rendering when the screen or tab is inactive.
- 🌌 **3D Parallax Tilt Effect:** Smooth 3D tilt effect responding to mouse movement and cursor position.
- 📱 **Mobile & Dynamic Viewport:** Uses `100dvh` (Dynamic Viewport Height) for responsive rendering across mobile devices and WebView containers.
- 🚪 **Android Native Exit Bridge:** Includes a minimal exit button (**`←`**) that calls `window.AndroidBridge.exitScreensaver()` when wrapped inside the Android Screensaver app.

---

## 🌐 Route & Query Parameter Modes

Configure display modes by appending query parameters to the URL:

| URL Query Parameter | Target Environment | Features & Behavior |
|---|---|---|
| **`?mode=android`** | **Android Screensaver** | Hides domain label, enables exit button (**`←`**), locks `100dvh` mobile layout. |
| **`?mode=windows`** | **Windows Screensaver** | Hides domain label, optimizes desktop mouse physics & parallax. |
| *(None)* | **Standard Web** | Displays domain hostname label and standard web controls. |

---

## 🛠️ Project Structure & Modules

```
digital-clock/
├── assets/
│   ├── js/
│   │   ├── battery.js      # Battery level & charging status monitor
│   │   ├── clock.js        # Core time loop, pixel shifting, route mode logic
│   │   ├── cursor.js       # Mouse follower & 3D tilt effect
│   │   ├── dust.js         # Canvas cosmic dust particle engine
│   │   ├── effects.js      # Click ripple effects
│   │   ├── network.js      # Online/Offline status indicator
│   │   ├── state.js        # Mouse & app state management
│   │   └── themes.js       # Color palette & theme manager
│   ├── main.js             # Main ES Module entry point
│   └── style.css           # Modern CSS layout, animations & glassmorphism
└── index.html              # Main HTML markup
```

---

## 🚀 Deployment

Since this project is built using 100% Vanilla HTML, CSS, and ES Modules, it can be hosted anywhere without a build step:

### GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages** and select **Branch: main / root**.
3. Your clock will be live at `https://yourusername.github.io/digital-clock/`.

### Local Testing
Simply serve using any static server:
```bash
npx serve .
```

---

## 📄 License
MIT License. Free to use and customize.