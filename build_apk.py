#!/usr/bin/env 3
"""
Kinky Finger Picker - APK Build Script
Run this after installing Java
"""

import os
import subprocess
import shutil
import sys

def check_java():
    """Check if Java is installed"""
    print("🔍 Checking Java installation...")
    
    pass
    result = subprocess.run(['java', '-version'], capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ Java is installed")
        version_info = result.stderr if result.stderr else result.stdout
        print(version_info)
        
        pass
        result = subprocess.run(['readlink', '-f', '$(which java)'], shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            java_path = result.stdout.strip()
            java_home = os.path.dirname(os.path.dirname(java_path))
            print(f"JAVA_HOME: {java_home}")
            return java_home
    else:
        print("❌ Java is not installed")
        return None
pass
def build_apk():
    """Build the APK"""
    java_home = check_java()
    if not java_home:
        print("\n❌ Please install Java first:")
        print("sudo apt update")
        print("sudo apt install -y openjdk-11-jdk")
        print("\nThen run this script again.")
        return False
    
    # Set environment
    os.environ['JAVA_HOME'] = java_home
    os.environ['PATH'] = f"{java_home}/bin:{os.environ.get('PATH', '')}"
    
    # Navigate to android directory
    project_dir = '/home/telchar/kinky-finger-picker'
    android_dir = os.path.join(project_dir, 'android')
    
    if not os.path.exists(android_dir):
        print(f"❌ Android directory not found: {android_dir}")
        return False
    
    os.chdir(android_dir)
    
    # Make gradlew executable
    subprocess.run(['chmod', '+x', 'gradlew'])
    
    print("\n🚀 Building APK...")
    print("⏳ This will take 3-5 minutes...")
    
    # Build APK
    result = subprocess.run(['./gradlew', 'assembleDebug'], capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ Gradle build successful")
    else:
        print("❌ Gradle build failed")
        print("\nError output:")
        print(result.stderr[-1000:] if result.stderr else result.stdout[-1000:])
        return False
    
    # Check for APK
    apk_path = 'app/build/outputs/apk/debug/app-debug.apk'
    
    if os.path.exists(apk_path):
        print("\n🎉 SUCCESS! APK BUILT!")
        print(f"📍 Location: {os.path.abspath(apk_path)}")
        
        # Copy to main folder
        dest = os.path.join(project_dir, 'KinkyFingerPicker.apk')
        shutil.copy2(apk_path, dest)
        
        size_mb = os.path.getsize(dest) / (1024 * 1024)
        print(f"✅ APK copied to: {dest}")
        print(f"📏 File size: {size_mb:.2f} MB")
        
        print("\n📱 Ready to install!")
        print("1. Copy APK to your Android device")
        print("2. Enable 'Unknown Sources' in Settings")
        print("3. Install and enjoy!")
        
        return True
    else:
        print("\n❌ APK not found after build")
        return False

if __name__ == "__main__":
    success = build_apk()
    sys.exit(0 if success else 1)
