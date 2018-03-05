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

import NavBar       from '../common/TopNavBar';
import * as Global  from '../../Global';
import OrderList    from './OrderList';
import AddressList  from './AddressList';
import TopNavBarRightButtons from '../common/TopNavBarRightButtons';

class UserHome extends Component {

    static displayName = 'UserHome';
    static description = '个人中心';

    static propTypes = {};

    static defaultProps = {};

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

    toOrderList(orderStatus) {
        this.props.navigator.push({
            component: OrderList,
            hideNavBar: true,
            passProps: {
                orderStatus: orderStatus,
            },
        });
    }

    toAddressList() {
        this.props.navigator.push({
            component: AddressList,
            hideNavBar: true
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
                            onPress={() => this.toOrderList(null)}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#69c1f3'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center1.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>全部订单</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toOrderList('10')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#f5a42c'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center2.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>待付款</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toOrderList('20')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#fed349'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center3.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>待发货</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toOrderList('30')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#3fd2a0'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center4.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>待收货</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu}
                            onPress={() => this.toOrderList('40')}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#69c1f3'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center5.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>已完成</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu, {borderBottomWidth: 0}]}
                            onPress={() => this.toAddressList()}
                        >
                            <View style={styles.menuMain}>
                                <View style={[styles.menuMainLeft, {backgroundColor: '#f46c6c'}]}>
                                    <Image style={styles.menuMainLeftImg}
                                        source={require('../images/shop_center6.png')}
                                    />
                                </View>
                                <Text style={styles.menuName}>管理收货地址</Text>
                            </View>
                            <Image style={styles.menuRightImg}
                                source={require('../images/shop_center_right.png')}
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
            <NavBar title='个人中心'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
                rightButtons={(
                    <TopNavBarRightButtons
                        navigator={this.props.navigator}
                        showShoppingCart={true}
                    />
                )}
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

export default UserHome;



