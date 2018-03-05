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

import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';
import BottomNavBar from '../common/NavBar';
import AddressEdit  from './AddressEdit';

class AddressList extends Component {

    static displayName = 'AddressList';
    static description = '收货地址';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		addressList: null
	};

    constructor (props) {
        super(props);
        this.refreshFn = this.refreshFn.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
			    this.getData();
			});
		});
	}
	
	async getData() {
		this.showLoading();
	    let url = `${ShopUtil.ServerUrl}?act=app&op=address`;
	    let options = {
            method: "GET"
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
                addressList: responseData.root,
            });
            this.hideLoading();
        } catch(e) {
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
	    if(this.props.from == 'order') {
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
	    let url = `${ShopUtil.ServerUrl}?act=app&op=addressDefault&id=${id}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('设置成功');
            this.refreshFn();
        } catch(e) {
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
                    onPress: () => {}
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
	    let url = `${ShopUtil.ServerUrl}?act=app&op=addressOperate&type=del&id=${id}`;
        let options = {
            method: "GET"
        };
        try {
            let responseData = await this.request(url, options);
            if(!responseData)
                return false;
            if(!responseData.success) {
                this.toast(responseData.message);
                return false;
            }
            this.toast('删除成功');
            this.refreshFn();
        } catch(e) {
            this.handleRequestException(e);
        }
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
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

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '收货地址' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
			    rightButtons = {(
                    <View style = {[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
                        <TouchableOpacity style = {[Global._styles.NAV_BAR.BUTTON]} onPress = {this.add.bind(this)}>
                            <Text style = {{color: Global._colors.IOS_BLUE,}}>新增</Text>
                        </TouchableOpacity>
                    </View>
                )} 
			/>
		);
	}
	
	renderRow(v, i) {
        return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.item}
                    onPress={() => this.onPressList(v.address_id)}
                >
                    <Text style={styles.orderItem}>
                        {v.true_name}，{v.mob_phone}{v.is_default == '1' ? '（默认地址）' : null}
                    </Text>
                    <Text style={styles.orderItem}>{v.area_info} {v.address}</Text>
                </TouchableOpacity>
                <View style={styles.btnBar}>
                    <Button text="设为默认"
                        size="small"
                        disabled={v.is_default == '1'}
                        onPress={() => this.setDefault(v.address_id)} 
                    />
                    <Separator width={10} />
                    <Button text="编辑"
                        size="small"
                        onPress={() => this.onPressList(v.address_id)} 
                    />
                    <Separator width={10} />
                    <Button text="删除"
                        size="small"
                        onPress={() => this.deleteAddress(v.address_id)} 
                    />
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
	    padding: 15,
	    borderBottomColor: '#ccc',
	    borderBottomWidth: 1,
	},
	item: {
        justifyContent: 'center',
	},
	btnBar: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    paddingTop: 15,
	},
	btn: {
	    height: 35,
	},
});

export default AddressList;



