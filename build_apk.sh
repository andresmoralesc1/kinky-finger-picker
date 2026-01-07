#!/bin/bash
# Kinky Finger Picker - APK Build Script (Shell Version)

echo "🔍 Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed"
    echo "Please install Java first:"
    echo "sudo apt update"
    echo "sudo apt install -y openjdk-11-jdk"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Java is installed"
java -version

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Navigate to android directory
cd /home/telchar/kinky-finger-picker/android

# Make gradlew executable
chmod +x gradlew

echo ""
echo "🚀 Building APK..."
echo "⏳ This will take 3-5 minutes..."

# Build APK
./gradlew assembleDebug

# Check for APK
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "🎉 SUCCESS! APK BUILT!"
    
    # Copy to main folder
    cp app/build/outputs/apk/debug/app-debug.apk ../KinkyFingerPicker.apk
    
    echo "✅ APK copied to: /home/telchar/kinky-finger-picker/KinkyFingerPicker.apk"
    
    # Show file size
    ls -lh ../KinkyFingerPicker.apk
    
    echo ""
    echo "📱 Ready to install!"
    echo "1. Copy APK to your Android device"
    echo "2. Enable 'Unknown Sources' in Settings"
    echo "3. Install and enjoy!"
else
    echo ""
    echo "❌ Build failed - APK not found"
fi
