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
    Alert,
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from '../common/TopNavBar';
import Message from '../common/Message';
import AddressEdit  from './AddressEdit';

class AddressList extends Component {

    static displayName = 'AddressList';
    static description = '收货地址';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        addressList: null
    };

    constructor(props) {
        super(props);
        this.refreshFn = this.refreshFn.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                this.getData();
            });
        });
    }

    async getData() {
        this.showLoading();
        let url = `${Global.ServerUrl}?act=app&op=address`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            this.hideLoading();
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if (!responseData.root)
                return false;
            this.setState({
                addressList: responseData.root,
            });
            if (responseData.root.length == 0 && this.props.from == 'order') {
                this.props.refreshFn && this.props.refreshFn(null);
            }
        } catch (e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }

    refreshFn() {
        this.getData();
    }

    add() {
        this.props.navigator.push({
            component: AddressEdit,
            hideNavBar: true,
            passProps: {
                operateType: 'add',
                refreshFn: this.refreshFn,
            },
        });
    }

    onPressList(id) {
        if (this.props.from == 'order') {
            this.props.navigator.pop();
            this.props.refreshFn && this.props.refreshFn(id);
        } else {
            this.props.navigator.push({
                component: AddressEdit,
                hideNavBar: true,
                passProps: {
                    operateType: 'edit',
                    id: id,
                    refreshFn: this.refreshFn,
                },
            });
        }
    }

    async setDefault(id) {
        let url = `${Global.ServerUrl}?act=app&op=addressDefault&id=${id}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('设置成功');
            this.refreshFn();
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    deleteAddress(id) {
        Alert.alert(
            null,
            '确认删除吗？',
            [
                {
                    text: '取消',
                    onPress: () => {
                    }
                },
                {
                    text: '确认',
                    onPress: () => {
                        this.deleteAddressSubmit(id);
                    }
                },
            ]
        );
    }

    async deleteAddressSubmit(id) {
        let url = `${Global.ServerUrl}?act=app&op=addressOperate&type=del&id=${id}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('删除成功');
            this.refreshFn();
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    {
                        (!this.state.addressList || this.state.addressList.length == 0) ?
                            <Message text="暂无数据"/> : null
                    }
                    {
                        !this.state.addressList ? null :
                            this.state.addressList.map((v, i) => {
                                return this.renderRow(v, i);
                            })
                    }
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
            <NavBar title='收货地址'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={false}
                hideBottomLine={false}
                rightButtons={(
                    <View style={styles.navContainer}>
                        <TouchableOpacity
                            style={styles.navBtn}
                            onPress={this.add.bind(this)}
                        >
                            <Image style={styles.navImage}
                                source={require('../images/address_nav_add.png')}
                            />
                            <Text style={styles.navTxt}>新增</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    }

    renderRow(v, i) {
        let isDefault = v.is_default == '1' ? true : false;
        let setDefaultSource = isDefault ?
            require('../images/checkbox_checked.png') :
            require('../images/checkbox_unchecked.png');
        let setDefaultStyle = [styles.toolBarItemTxt];
        if (isDefault) {
            setDefaultStyle.push(styles.toolBarItemTxtDefault);
        }
        return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.item}
                    onPress={() => this.onPressList(v.address_id)}
                >
                    <View style={styles.itemTop}>
                        <Text style={styles.itemTopTxt}>{v.true_name}</Text>
                        <Text style={styles.itemTopTxt}>{v.mob_phone}</Text>
                    </View>
                    <Text style={styles.itemBottomTxt}>{v.area_info} {v.address}</Text>
                </TouchableOpacity>
                <View style={styles.toolBar}>
                    <View style={styles.toolBarLeft}>
                        <TouchableOpacity
                            style={styles.toolBarItem}
                            disabled={v.is_default == '1'}
                            onPress={() => this.setDefault(v.address_id)}
                        >
                            <Image style={styles.defaultBtnImg}
                                source={setDefaultSource}
                            />
                            <Text style={setDefaultStyle}>设为默认</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.toolBarRight}>
                        <TouchableOpacity
                            style={styles.toolBarItem}
                            onPress={() => this.onPressList(v.address_id)}
                        >
                            <Image style={styles.defaultBtnImg}
                                source={require('../images/address_list_edit.png')}
                            />
                            <Text style={styles.toolBarItemTxt}>编辑</Text>
                        </TouchableOpacity>
                        <View style={styles.space}></View>
                        <TouchableOpacity
                            style={styles.toolBarItem}
                            onPress={() => this.deleteAddress(v.address_id)}
                        >
                            <Image style={styles.defaultBtnImg}
                                source={require('../images/address_list_del.png')}
                            />
                            <Text style={styles.toolBarItemTxt}>删除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    row: {
        marginTop: 10,
        borderTopColor: '#dcdce1',
        borderTopWidth: 1 / Global._pixelRatio,
        borderBottomColor: '#dcdce1',
        borderBottomWidth: 1 / Global._pixelRatio,
        backgroundColor: '#fff',
    },
    item: {
        padding: 16,
        justifyContent: 'center',
    },
    toolBar: {
        padding: 16,
        borderTopColor: Global.Color.LIGHTER_GRAY,
        borderTopWidth: 1 / Global._pixelRatio,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toolBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolBarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolBarItemTxt: {
        marginLeft: 10,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    toolBarItemTxtDefault: {
        color: Global.Color.RED,
    },
    itemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemTopTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    itemBottomTxt: {
        marginTop: 10,
        fontSize: Global.FontSize.SMALL,
        color: Global.Color.DARK_GRAY,
    },
    defaultBtnImg: {
        width: 13,
        height: 13,
        resizeMode: 'contain',
    },
    editBtnImg: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    delBtnImg: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    space: {
        width: 16,
    },
    navContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 16,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    navTxt: {
        marginLeft: 5,
        fontSize: Global.FontSize.BASE,
        color: '#fff',
    },
});

export default AddressList;



