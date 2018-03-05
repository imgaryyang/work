rm -rf ./android/app/build/outputs/apk/app-release.apk
cd ./android
./gradlew assembleRelease
DATE=$(date +%Y%m%d)
mv ./app/build/outputs/apk/app-release.apk ../../../../07.Installation/MNIS.$DATE.apk
