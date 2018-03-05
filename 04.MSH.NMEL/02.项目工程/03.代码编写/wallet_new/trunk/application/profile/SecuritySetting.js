'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    Dimensions,
    TextInput,
} from 'react-native';

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import ModifyGesturePassword  from './ModifyGesturePassword';
import UserStore from '../flux/UserStore';

class SecuritySetting extends Component {

    static displayName = 'SecuritySetting';
    static description = '安全设置';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        value: null,
        saveBtnDisabled: false,
        idCardNo: UserStore.getUser() && UserStore.getUser().idCardNo,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {

            });
        });
    }

    modifyPassword() {
        this.props.navigator.push({
            component: ModifyGesturePassword,
            hideNavBar: true
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets={false}>
                    <View style={styles.main}>
                        <View style={styles.item}>
                            <Text style={styles.itemTxt}>身份证号</Text>
                            <Text style={styles.itemTxt}>{this.state.idCardNo}</Text>
                        </View>
                        <TouchableOpacity style={[styles.item, styles.btn]}
                            onPress={this.modifyPassword.bind(this)}
                        >
                            <Text style={styles.itemTxt}>修改手势密码</Text>
                            <Image style={styles.rightImg}
                                source={require('../store/images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar() {
        return (
            <NavBar title='安全设置'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
            />
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    main: {
        marginHorizontal: 8,
        marginVertical: 10,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    item: {
        padding: 16,
        borderBottomColor: Global.Color.LIGHTER_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        justifyContent: 'space-between',
        borderBottomWidth: 0,
    },
    itemTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
        marginRight: 10,
    },
    rightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
    },
});

export default SecuritySetting;



