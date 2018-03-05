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

import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';
import BottomNavBar from '../common/NavBar';
import Checkbox from '../common/Checkbox';
import AreaList from '../common/AreaList';

class AddressEdit extends Component {

    static displayName = 'AddressEdit';
    static description = '编辑地址';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        saveBtnDisabled: false,
        id: null,
        name: null,
        tel: null,
        area_id: null,
        city_id: null,
        area_info: null,
        address: null,
        isDefault: '0',
    };

    constructor (props) {
        super(props);
        this.navTitle = this.props.operateType == 'add' ? '新增地址' : '编辑地址';
        this.refreshFn = this.refreshFn.bind(this);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true}, () => {
                if(this.props.operateType == 'edit') {
                    this.getDetail();
                }
            });
        });
    }
    
    async getDetail() {
        let areaId = this.props.id;
        let url = `${ShopUtil.ServerUrl}?act=app&op=addressShow&id=${areaId}`;
        let options = {
            method: "GET",
        };
        try {
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            if(!responseData.root)
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
        } catch(e) {
            this.handleRequestException(e);
        }
    }
    
    async save() {
        if(this.state.name == null || this.state.name.trim() == '') {
            this.toast('请输入收货人');
            return false;
        }
        if(this.state.tel == null || this.state.tel.trim() == '') {
            this.toast('请输入手机号码');
            return false;
        }
        if(this.state.area_id == null || this.state.city_id == null) {
            this.toast('请选择地区');
            return false;
        }
        if(this.state.address == null || this.state.address.trim() == '') {
            this.toast('请输入详细地址');
            return false;
        }
        
        let url = `${ShopUtil.ServerUrl}?act=app&op=addressOperate&type=${this.props.operateType}`;
        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: ShopUtil.toQueryString({
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
        this.setState({ saveBtnDisabled: true });
        try {
            let responseData = await this.request(url, options);
            this.setState({ saveBtnDisabled: false });
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('保存成功');
            this.props.navigator.pop();
            this.props.refreshFn && this.props.refreshFn();
        } catch(e) {
            this.setState({ saveBtnDisabled: false });
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
        if(!areaArr)
            return false;
        let areaNameArr = [];
        for(let area of areaArr) {
            areaNameArr.push(area.area_name);
            if(area.area_deep == '2') {
                this.state.city_id = area.area_id;
            } else if(area.area_deep == '3') {
                this.state.area_id = area.area_id;
            }
        }
        this.setState({
            area_info: areaNameArr.join(' '),
        });
    }
    
    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ScrollView style = {styles.scrollView} >
                    <View style={styles.item}>
                        <Text style={styles.label}>收货人</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid="transparent" 
                            placeholder="请输入收货人"
                            placeholderTextColor="#ccc"
                            value={this.state.name}
                            onChangeText={(value) => {
                                this.setState({
                                    name: value
                                });
                            }}    
                        />
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>手机号码</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid="transparent" 
                            placeholder="请输入手机号码"
                            placeholderTextColor="#ccc"
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
                        <View style={styles.areaContainer}>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent" 
                                placeholder="请选择地区"
                                placeholderTextColor="#ccc"
                                editable={false}
                                multiline={true}
                                value={this.state.area_info}
                            />
                            <Button text="选择" 
                                size="small"
                                onPress={() => this.selectArea()} 
                            />
                        </View>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>详细地址</Text>
                        <TextInput 
                            style={styles.input}
                            multiline={true} 
                            underlineColorAndroid="transparent" 
                            placeholder="请输入详细地址"
                            placeholderTextColor="#ccc"
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
                            <Checkbox style={{paddingLeft: 0}}
                                checked={this.state.isDefault == '1' ? true : false}
                                onCheck={(checked) => {
                                    this.state.isDefault = checked ? '1' : '0';
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
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
            <NavBar title = {this.navTitle} 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {false} 
                hideBottomLine = {false}
                rightButtons = {(
                    <View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
                        <TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} 
                            disabled={this.state.saveBtnDisabled}
                            onPress = {this.save.bind(this)}
                        >
                            <Text style = {{color: Global._colors.IOS_BLUE,}}>保存</Text>
                        </TouchableOpacity>
                    </View>
                )} 
            />
        );
    }
    
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 45,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    label: {
        flex: 1,
        color: '#444',
    },
    input: {
        flex: 3,
        padding: 0,
        height: 40,
    },
    areaContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default AddressEdit;



