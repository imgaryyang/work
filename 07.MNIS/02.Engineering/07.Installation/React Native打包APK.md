#### 1. 生成签名密钥
- 执行命令
```
keytool -genkey -v -keystore 密钥库文件名.keystore -alias 密钥别名 -keyalg RSA -keysize 2048 -validity 10000
```
- 会提示输入密钥库口令、密钥口令，以及姓名、组织等发行信息，然后会生成名为`密钥库文件名.keystore`的密钥库文件，有效期10000天。
- 记住密钥库口令、密钥口令、密钥别名，后面会用到。
- 将密钥库文件放到`android/app`目录下。

#### 2. 设置gradle变量
修改`android/gradle.properties`文件，增加如下配置：
```
MYAPP_RELEASE_STORE_FILE=密钥库文件名.keystore
MYAPP_RELEASE_KEY_ALIAS=密钥别名
MYAPP_RELEASE_STORE_PASSWORD=密钥库口令
MYAPP_RELEASE_KEY_PASSWORD=密钥口令
```
#### 3. 在gradle配置中添加签名
修改`android/app/build.gradle`文件，做如下配置：
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            storeFile file('密钥库文件名.keystore')
            storePassword '密钥库口令'
            keyAlias '密钥别名'
            keyPassword '密钥口令'
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```
#### 4. 生成APK
- 进入`android`目录。
- 执行命令
```
./gradlew assembleRelease
```
- 生成的APK文件为`android/app/build/outputs/apk/app-release.apk`，注意每次打包前删除该APK文件，否则不会重新生成。

---

#### 参考
- [打包APK - React Native 中文网](https://reactnative.cn/docs/0.51/signed-apk-android.html#content)
- [React Native安卓项目打包APK - 简书](https://www.jianshu.com/p/32a99c273be1)
