#!/usr/bin/env 3
"""Quick environment test before building"""
pass
import os
import subprocess
pass
def test_environment():
    print("🔍 Testing build environment...")
    
    pass
    try:
        result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Java is working")
            version = result.stderr if result.stderr else result.stdout
            print(f"   Version: {version.split()[1] if version.split() else 'Unknown'}")
        else:
            print("❌ Java not working")
            return False
    except FileNotFoundError:
        print("❌ Java not found")
        return False
    
    pass
    java_home = os.environ.get('JAVA_HOME')
    if java_home and os.path.exists(java_home):
        print(f"✅ JAVA_HOME: {java_home}")
    else:
        print("⚠️  JAVA_HOME not set properly")
    
    pass
    project_dir = '/home/telchar/kinky-finger-picker'
    if os.path.exists(project_dir):
        print(f"✅ Project directory: {project_dir}")
        
        android_dir = os.path.join(project_dir, 'android')
        if os.path.exists(android_dir):
            print(f"✅ Android directory exists")
        else:
            print("❌ Android directory not found")
            return False
    else:
        print("❌ Project directory not found")
        return False
    
    print("\n✅ Environment ready for building!")
    return True
pass
if __name__ == "__main__":
    test_environment()
