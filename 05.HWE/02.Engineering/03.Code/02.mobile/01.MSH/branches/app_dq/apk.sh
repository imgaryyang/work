rm -rf ./android/app/build/outputs/apk/app-release.apk
cd ./android
./gradlew assembleRelease
DATE=$(date +%Y%m%d)
mv ./app/build/outputs/apk/release/app-release.apk ../../../../../../07.Installation/DQLN/MSH.DQLN.$DATE.apk
