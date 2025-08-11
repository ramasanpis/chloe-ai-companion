
# Building Android APK in Termux

This guide shows you how to build the AI Companion app as an Android APK using Termux without Android Studio.

## Prerequisites

### 1. Install Required Packages in Termux
```bash
# Update packages
pkg update && pkg upgrade

# Install essential packages
pkg install nodejs npm openjdk-17 wget git

# Install Android SDK
pkg install android-tools
```

### 2. Set Environment Variables
Add these to your `~/.bashrc` or `~/.zshrc`:
```bash
export JAVA_HOME=$PREFIX/opt/openjdk-17
export ANDROID_HOME=$PREFIX/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### 3. Download Android SDK
```bash
# Create Android SDK directory
mkdir -p $PREFIX/opt/android-sdk

# Download command line tools
cd $PREFIX/opt/android-sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip
rm commandlinetools-linux-9477386_latest.zip

# Accept licenses and install build tools
yes | ./cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses
./cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "build-tools;33.0.0" "platforms;android-33"
```

## Building the APK

### Method 1: Using the Build Script
```bash
# Make the script executable
chmod +x scripts/build-android.sh

# Run the build
./scripts/build-android.sh
```

### Method 2: Manual Build
```bash
# Install dependencies
npm install

# Build web app
npm run build

# Add Android platform
npx cap add android

# Sync Capacitor
npx cap sync android

# Build APK
cd android
chmod +x ./gradlew
./gradlew assembleDebug
```

## Output

The APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions Alternative

If building locally is too complex, you can:
1. Push your code to GitHub
2. The GitHub Actions workflow will automatically build the APK
3. Download the APK from the Actions artifacts or Releases section

## Troubleshooting

### Common Issues:
- **Out of memory**: Increase Termux heap size or use a device with more RAM
- **Permission denied**: Make sure gradlew has execute permissions
- **SDK not found**: Verify ANDROID_HOME environment variable is set correctly

### Performance Tips:
- Use `./gradlew assembleDebug --offline` for faster builds
- Close other apps to free up memory during build
- Consider using GitHub Actions for complex builds
