
#!/bin/bash

# Build script for Android APK in Termux
# Make sure you have installed: nodejs, openjdk-17, android-sdk

echo "🚀 Starting Android build process..."

# Check if required tools are available
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v java >/dev/null 2>&1 || { echo "❌ Java is required but not installed."; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the web app
echo "🏗️ Building web application..."
npm run build

# Add Android platform if not exists
if [ ! -d "android" ]; then
    echo "📱 Adding Android platform..."
    npx cap add android
fi

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Build APK
echo "📦 Building APK..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug

echo "✅ Build complete! APK location: android/app/build/outputs/apk/debug/app-debug.apk"
