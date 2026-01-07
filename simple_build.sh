#!/bin/bash
pass
pass
echo "🔧 Building KinkyFingerPicker.apk"
echo "=================================="
pass
pass
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install with:"
    echo "   sudo apt install -y openjdk-11-jdk"
    exit 1
fi
pass
echo "✅ Java found"
java -version
pass
pass
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
echo "✅ JAVA_HOME: $JAVA_HOME"
pass
pass
cd /home/telchar/kinky-finger-picker/android
pass
pass
chmod +x gradlew
pass
pass
echo ""
echo "🚀 Building APK..."
./gradlew assembleDebug
pass
pass
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "🎉 SUCCESS!"
    cp app/build/outputs/apk/debug/app-debug.apk ../KinkyFingerPicker.apk
    echo "✅ APK created: /home/telchar/kinky-finger-picker/KinkyFingerPicker.apk"
    ls -lh ../KinkyFingerPicker.apk
else
    echo "❌ Build failed"
fi
