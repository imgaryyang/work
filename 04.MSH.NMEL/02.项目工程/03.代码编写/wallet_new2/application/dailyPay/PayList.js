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
} from 'react-native';

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import DPay from './Index';

class PayList extends Component {

    static displayName = 'PayList';
    static description = '更多缴费';

    state = {
        doRenderScene: false,
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

    toPay(typeName,title) {
        if(!typeName || !title)
            return;

        this.props.navigator.push({
            component:DPay,
            hideNavBar:true,
            passProps:{
                type:typeName,
                title:title,
            }
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.main}>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toPay('dian','电费缴费')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#f5a42c'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../res/images/dailypay/01.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>电费</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                   source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toPay('tv','有线电视缴费')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#3fd2a0'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/04.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>有线电视</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toPay('phone','手机充值')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#69c1f3'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/07.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>手机充值</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toPay('30')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: Global.Color.LIGHT_GRAY}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/02.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>水费</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                   source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toPay('40')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: Global.Color.LIGHT_GRAY}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/03.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>煤气费</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                   source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu]}
                            onPress={() => this.toPay()}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: Global.Color.LIGHT_GRAY}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/05.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>固话</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                   source={require('../res/images/dailypay/right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu, {borderBottomWidth: 0}]}
                                          onPress={() => this.toPay()}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: Global.Color.LIGHT_GRAY}]}>
                                    <Image style={styles.menuMainLeftImg}
                                           source={require('../res/images/dailypay/06.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>宽带</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                   source={require('../res/images/dailypay/right.png')}
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
            <NavBar title='更多缴费'
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
        margin: 10,
        borderColor: Global.Color.LIGHT_GRAY,
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    menu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    menuMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuMainLeft: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#69c1f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuMainLeftImg: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    menuName: {
        marginLeft: 10,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    menuRightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
    },
});

export default PayList;



