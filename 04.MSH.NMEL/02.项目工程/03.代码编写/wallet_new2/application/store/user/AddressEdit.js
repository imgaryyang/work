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
    TextInput,
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from '../common/TopNavBar';
import Button       from 'rn-easy-button';
import Checkbox from '../common/Checkbox';
import AreaList from '../common/AreaList';

class AddressEdit extends Component {

    static displayName = 'AddressEdit';
    static description = '编辑地址';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        saveBtnDisabled: false,
        id: null,
        name: null,
        tel: null,
        area_id: null,
        city_id: null,
        area_info: '请选择地区',
        address: null,
        isDefault: '0',
    };

    constructor(props) {
        super(props);
        this.navTitle = this.props.operateType == 'add' ? '新增地址' : '编辑地址';
        this.refreshFn = this.refreshFn.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                if (this.props.operateType == 'edit') {
                    this.getDetail();
                }
            });
        });
    }

    async getDetail() {
        let areaId = this.props.id;
        let url = `${Global.ServerUrl}?act=app&op=addressShow&id=${areaId}`;
        let options = {
            method: "GET",
        };
        try {
            let responseData = await this.request(url, options);
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if (!responseData.root)
                return false;
            this.setState({
                doRenderScene: true,
                id: responseData.root.address_id,
                name: responseData.root.true_name,
                tel: responseData.root.mob_phone,
                area_id: responseData.root.area_id,
                city_id: responseData.root.city_id,
                area_info: responseData.root.area_info,
                address: responseData.root.address,
                isDefault: responseData.root.is_default,
            });
        } catch (e) {
            this.handleRequestException(e);
        }
    }

    async save() {
        if (this.state.name == null || this.state.name.trim() == '') {
            this.toast('请输入收货人');
            return false;
        }
        if (this.state.tel == null || this.state.tel.trim() == '') {
            this.toast('请输入手机号码');
            return false;
        }
        if (this.state.area_id == null || this.state.city_id == null) {
            this.toast('请选择地区');
            return false;
        }
        if (this.state.address == null || this.state.address.trim() == '') {
            this.toast('请输入详细地址');
            return false;
        }

        let url = `${Global.ServerUrl}?act=app&op=addressOperate&type=${this.props.operateType}`;
        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Global.toQueryString({
                id: this.state.id,
                true_name: this.state.name,
                area_id: this.state.area_id,
                city_id: this.state.city_id,
                area_info: this.state.area_info,
                mob_phone: this.state.tel,
                address: this.state.address,
                is_default: this.state.isDefault,
            })
        };
        this.setState({saveBtnDisabled: true});
        try {
            let responseData = await this.request(url, options);
            this.setState({saveBtnDisabled: false});
            if (!responseData)
                return false;
            if (!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('保存成功');
            this.props.navigator.pop();
            this.props.refreshFn && this.props.refreshFn();
        } catch (e) {
            this.setState({saveBtnDisabled: false});
            this.handleRequestException(e);
        }
    }

    selectArea() {
        this.props.navigator.push({
            component: AreaList,
            hideNavBar: true,
            passProps: {
                areaId: null,
                refreshFn: this.refreshFn,
                displayName: AddressEdit.displayName,
            },
        });
    }

    refreshFn(areaArr) {
        if (!areaArr)
            return false;
        let areaNameArr = [];
        for (let area of areaArr) {
            areaNameArr.push(area.area_name);
            if (area.area_deep == '2') {
                this.state.city_id = area.area_id;
            } else if (area.area_deep == '3') {
                this.state.area_id = area.area_id;
            }
        }
        this.setState({
            area_info: areaNameArr.join(' '),
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();

        let areaTxtStyle = [styles.areaTxt];
        if (this.state.area_info == '请选择地区') {
            areaTxtStyle.push(styles.areaTxtGray);
        }
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.main}>
                        <View style={styles.item}>
                            <Text style={styles.label}>收货人</Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="请输入收货人姓名"
                                placeholderTextColor={Global.Color.GRAY}
                                value={this.state.name}
                                onChangeText={(value) => {
                                    this.setState({
                                        name: value
                                    });
                                }}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>手机号</Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="请输入常用手机号码"
                                placeholderTextColor={Global.Color.GRAY}
                                value={this.state.tel}
                                onChangeText={(value) => {
                                    this.setState({
                                        tel: value
                                    });
                                }}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>地区</Text>
                            <TouchableOpacity style={styles.areaContainer}
                                onPress={this.selectArea.bind(this)}
                            >
                                <View style={{flex: 1}}>
                                    <Text style={areaTxtStyle}>{this.state.area_info}</Text>
                                </View>
                                <Image style={styles.rightImg}
                                    source={require('../images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>详细地址</Text>
                            <TextInput
                                style={styles.input}
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholder="请输入详细的收货地址"
                                placeholderTextColor={Global.Color.GRAY}
                                value={this.state.address}
                                onChangeText={(value) => {
                                    this.setState({
                                        address: value
                                    });
                                }}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>设为默认</Text>
                            <View style={{flex: 3}}>
                                <Checkbox style={styles.checkbox}
                                    checked={this.state.isDefault == '1' ? true : false}
                                    onCheck={(checked) => {
                                        this.state.isDefault = checked ? '1' : '0';
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.save.bind(this)}
                    >
                        <Text style={styles.btnTxt}>保存</Text>
                    </TouchableOpacity>
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
            <NavBar title={this.navTitle}
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
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        height: 48,
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    label: {
        flex: 1,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    input: {
        flex: 3,
        padding: 0,
        height: 40,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    areaTxt: {
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
        flexWrap: 'wrap',
    },
    areaTxtGray: {
        color: Global.Color.GRAY,
    },
    areaContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    btn: {
        marginTop: 40,
        marginLeft: 10,
        marginRight: 10,
        height: 44,
        backgroundColor: Global.Color.RED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
    checkbox: {
        paddingVertical: 10,
    },
});

export default AddressEdit;



