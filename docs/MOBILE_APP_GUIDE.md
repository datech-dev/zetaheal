# Zeta Heal Caregiver — Mobile Application Installation & Run Guide

The **Zeta Heal Caregiver** mobile companion (`apps/mobile`) is built with React Native and Expo. It supports multi-language therapy programs (English & Tamil), offline logging, child activity tracking, and non-stigmatizing feedback.

## 📥 Direct Download Standalone Android APK (v1.0.0)

You can download and install the mobile app directly on any Android smartphone:

- **Direct APK Download Link**: [Download zetaheal-caregiver.apk](https://github.com/datech-dev/zetaheal/releases/download/caregiver-mobile-v1.0.0/zetaheal-caregiver.apk)
- **GitHub Release Page**: [Zeta Heal Caregiver Android App v1.0.0](https://github.com/datech-dev/zetaheal/releases/tag/caregiver-mobile-v1.0.0)

### Quick Installation Steps:
1. Open the download link above on your Android phone.
2. Tap **Download anyway** (if prompted by Chrome / Android browser).
3. Once downloaded, tap the file in your notification bar or **Downloads** folder.
4. Tap **Install** (if prompted, enable *"Install unknown apps"* for your browser).
5. Open **Zeta Heal Caregiver** from your home screen!

---

## Method 1: Instant Launch on Physical Phone via Expo Go (Fastest & Easiest)

You can run the app directly on your physical Android phone or iPhone within 2 minutes without needing to compile APKs or set up Android Studio.

### Step 1: Install Expo Go on your mobile device
- **Android**: Install [Expo Go from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone (iOS)**: Install [Expo Go from Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 2: Start the mobile dev server
Open a terminal in the project directory:

```bash
cd "c:\Users\dhine\OT platform\apps\mobile"
npx expo start --tunnel
```

*(Note: `--tunnel` allows your phone to connect over cellular data or different Wi-Fi networks without firewall issues).*

### Step 3: Scan the QR code
1. A QR code will appear in your computer terminal.
2. **On Android**: Open the **Expo Go** app and tap **"Scan QR code"**.
3. **On iPhone**: Open the default **Camera app** and point it at the QR code. Tap the banner that pops up.
4. **Zeta Heal Caregiver** will load directly on your phone!

---

## Method 2: Generate a Standalone Android APK File (Direct Phone Install)

If you want a downloadable `.apk` file that caregivers or team members can install directly on any Android device without installing developer tools:

We have pre-configured `apps/mobile/eas.json` with a `preview` APK profile.

### Step 1: Install the Expo Application Services (EAS) CLI
Run in terminal:
```bash
npm install -g eas-cli
```

### Step 2: Log in or create a free Expo account
```bash
eas login
```
*(If you do not have an Expo account, create a free one at https://expo.dev/signup).*

### Step 3: Run the Cloud Build for Android APK
```bash
cd "c:\Users\dhine\OT platform\apps\mobile"
eas build -p android --profile preview
```

### Step 4: Install the APK on your Android device
1. Once the EAS build completes (typically 3-5 minutes on Expo's free cloud builders), the terminal will provide a **Download URL** and a **QR code**.
2. Scan the QR code or open the link on your Android phone.
3. Tap **Download .apk**.
4. When downloaded, tap the file in your notifications or Downloads folder and select **Install**.
   *(If prompted by Android, toggle "Allow from this source" in Chrome/Files settings).*
5. The **Zeta Heal Caregiver** app is now permanently installed on your home screen!

---

## Method 3: Local Android Studio Emulator / USB Debugging

For development on an Android Emulator or directly plugged-in device:

### Prerequisites:
- Android Studio installed with Android SDK (API 34+)
- Environment variables configured: `ANDROID_HOME` pointing to your SDK path.

### Run commands:
```bash
cd "c:\Users\dhine\OT platform\apps\mobile"
npx expo run:android
```

---

## Method 4: Access via Mobile Web / PWA (Instant Access for Therapists & Parents)

Both the web dashboard and parent views are responsive and mobile-optimized. You can install the web application directly onto any smartphone as a Progressive Web App (PWA):

1. Open **`https://zetaheal.zetalink.cloud`** in Google Chrome (Android) or Safari (iPhone).
2. **On Android (Chrome)**:
   - Tap the three dots menu (⋮) in the top-right corner.
   - Tap **"Install App"** or **"Add to Home Screen"**.
3. **On iOS (Safari)**:
   - Tap the **Share** button (box with upward arrow) at the bottom.
   - Scroll down and tap **"Add to Home Screen"**.
4. An icon will appear on your phone's home screen that opens Zeta Heal in full-screen standalone mode.

---

## Mobile Application Features

| Feature | Description |
| :--- | :--- |
| **Activity Instructions** | Step-by-step illustrated tasks with required materials and safety warnings |
| **One-Tap Logging** | Quick log buttons: "Completed", "Partial practice", "Not practiced" |
| **Bilingual Support** | Instant toggle between **English** and **Tamil (தமிழ்)** |
| **Caregiver Affirmations** | Non-stigmatizing encouragement acknowledging family effort and routine pacing |
| **Offline Synchronization** | Local queue captures practice logs and syncs with the clinical server |
