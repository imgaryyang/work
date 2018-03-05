/**
 * 扫码付
 */
'use strict';

import React, {
    Component
} from 'react';

import {
    View,
    StyleSheet,
    InteractionManager,
    Dimensions,
    Platform,
    Vibration,
    VibrationIOS,
} from 'react-native';

import * as Global  from '../Global';
import NavBar       from '../store/common/TopNavBar';
import BarcodeScanner from 'react-native-barcodescanner';
import Camera from 'react-native-camera';

/**
 * TODO
 * 1. 可以修饰这个扫码器更好看，通过插件提供的接口
 * 2. 如果是IOS系统，可以使用 react-native-camera ，此插件已通过import引入
 * 请参考官网实现其扫码功能 https://github.com/lwansbrough/react-native-camera
 *
 *
 */
const nbHeight = Platform.OS === 'ios' ? 64 : 48;
const Width =Dimensions.get('window').height - nbHeight;
class Saofu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            torchMode: 'off',
            cameraType: 'back',
            wait:false,
            doRenderScene: false,
        };
    }

    _timer = [];

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }

    barcodeReceived(e) {
        if(this.state.wait)
            return;

        this.setState({
            wait:true
        },()=>{
            Vibration.vibrate(100);     //震动反馈
            this.toast("不是合作商家的付款码");

            console.log('Barcode: ' + e.data);
            console.log('Type: ' + e.type);

            //使用定时器控制扫码调用的时间间隔
            this._timer.length = setTimeout(()=>{
                this.setState({
                    wait:false,
                });
            },3000)
        });
    }
    _onBarCodeRead(result){
        if(this.state.wait)
            return;

        this.setState({
            wait:true
        },()=>{
            VibrationIOS.vibrate();  //震动反馈
            this.toast("不是合作商家的付款码");

            console.log('Barcode: ' + result.data);
            console.log('result: ' + result);

            //使用定时器控制扫码调用的时间间隔
            this._timer.length = setTimeout(()=>{
                this.setState({
                    wait:false,
                });
            },5000)
        });
    }

    /**
     * 清除定时器
     */
    componentWillUnmount () {
        if(this._timer.length!=0){
            for(let t in this._timer){
                clearTimeout(t);
            }
        }
    }
    _getView(){
        if(Global._os === 'ios'){
            return (
                <Camera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera}>
                    <View style={styles.rectangle}>
                    </View>
                </Camera>
            );

        } else {
            return (
            <BarcodeScanner
                onBarCodeRead={this.barcodeReceived.bind(this)}
                style={{ flex: 1 }}
            />
            );
        }
    }

    render() {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER}>
                {this._getNavBar()}
                {this._getView()}
            </View>
        );
    }

    _renderPlaceholderView () {
        return (
            <View style = {Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar () {
        return (
            <NavBar title='扫码付'
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBottomLine = {false} />
        );
    }
}

export default Saofu;
const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});


