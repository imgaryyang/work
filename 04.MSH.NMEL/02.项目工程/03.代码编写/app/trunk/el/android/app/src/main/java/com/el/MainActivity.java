package com.el;

import com.facebook.react.ReactActivity;
import cn.reactnative.modules.jpush.JPushPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.eguma.barcodescanner.BarcodeScanner;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import cn.jpush.android.api.JPushInterface;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "el";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected void onPause() {
      super.onPause();
      JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
      super.onResume();
      JPushInterface.onResume(this);
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new JPushPackage(),
            new VectorIconsPackage(),
            new RCTCameraPackage(),
            new BarcodeScanner()
        );
    }
}
