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
	Alert,
} from 'react-native';

import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';
import Checkbox from '../common/Checkbox';
import Message from '../common/Message';
import GoodsDetail from '../goods/GoodDetail';
import Order from '../goods/Order';
import ShopAction   from '../../flux/ShopAction';

class List extends Component {

    static displayName = 'ShoppingCart';
    static description = '购物车';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		loading: true,
		delBtnDisabled: true,
		list: null,
		checkedAll: false,
		checkedItems: [],
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
			    this.getListData();
			});
		});
	}
	
	async getListData() {
		this.showLoading();
	    let url = `${ShopUtil.ServerUrl}?act=interface_app&op=cartlist&user_id=6`;
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
            this.hideLoading();
            this.setState({
            	loading: false,
                list: responseData.root,
            });
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	async updateGoods(id, num, i) {
	    let url = `${ShopUtil.ServerUrl}?act=interface_app&op=update&cart_id=${id}&quantity=${num}&user_id=6`;
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
            this.state.list[i].goods_num = num;
            this.setState({
            	list: this.state.list,
            });
            this.updateShoppingCartNum();
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	async deleteGoods(id) {
	    let url = `${ShopUtil.ServerUrl}?act=interface_app&op=del&cart_id=${id}&user_id=6`;
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
            this.state.list.forEach((v, i) => {
            	if(v.cart_id == id){
            		this.state.list.splice(i, 1);
            	}
            });
            this.setState({
            	list: this.state.list,
            	delBtnDisabled: true,
            });
            this.toast('删除成功');
            this.updateShoppingCartNum();
        } catch(e) {
            this.handleRequestException(e);
        }
    }
	
	submit() {
		let selectedGoods = [];
		if (!this.state.list || this.state.list.length == 0)
			return false;
		for (let goods of this.state.list) {
			if (!goods.checked)
				continue;
			selectedGoods.push(goods);
		}
		if (selectedGoods.length == 0) {
			this.toast('请选择商品');
			return false;
		}
		this.props.navigator.push({
            component: Order,
            hideNavBar: true,
            passProps: {
            	goods: selectedGoods,
            	from: 'cart',
	        },
        });
    }
	
	onDelete() {
		let selectedGoods = [];
		if (!this.state.list || this.state.list.length == 0)
			return false;
		for (let goods of this.state.list) {
			if (!goods.checked)
				continue;
			selectedGoods.push(goods);
		}
		if (selectedGoods.length == 0) {
			this.toast('请选择商品');
			return false;
		}
		this.state.list.forEach((v, i) => {
			if (v.checked) {
				this.deleteGoods(v.cart_id);
			}
		});
	}
	
	updateShoppingCartNum() {
		let num = 0;
        for(let item of this.state.list) {
        	num += Number(item.goods_num);
        }
		ShopAction.onShoppingCartNumReset(num);
	}
	
	onCheckAll(checked) {
	    for(let item of this.state.list) {
	        item.checked = checked;
	    }
	    this.setState({
	        checkedAll: checked,
	        list: this.state.list,
	        delBtnDisabled: checked ? false : true,
	    });
	}
	
	onCheckItem(checked, index) {
	    this.state.list[index].checked = checked;
	    let count = 0;
	    for(let item of this.state.list) {
            if(item.checked)
                count++;
        }
	    if(count > 0)
	    	this.state.delBtnDisabled = false;
	    this.setState({
	        checkedAll: count == this.state.list.length ? true : false,
	        delBtnDisabled: count > 0 ? false : true,
	    });
	}
	
	onGoodsNumSub(i) {
	    let numStr = this.state.list[i].goods_num;
        let num = isNaN(Number(numStr)) ? 1 : Number(numStr);
        if(num == 1)
        	return false;
        num--;
//        if(num <= 0) {
//            Alert.alert(
//                null,
//                '确认将该商品从购物车中删除吗？',
//                [
//                    {
//                        text: '取消',
//                        onPress: () => {}
//                    },
//                    {
//                        text: '确认',
//                        onPress: () => {
//                        	this.deleteGoods(this.state.list[i].cart_id, i);
//                        }
//                    },
//                ]
//            )
//            return false;
//        }
        this.updateGoods(this.state.list[i].cart_id, num, i);
	}
	
	onGoodsNumAdd(i) {
	    let numStr = this.state.list[i].goods_num;
        let num = isNaN(Number(numStr)) ? 1 : Number(numStr);
        if (++num <= 0)
            num = 1;
        this.updateGoods(this.state.list[i].cart_id, num, i);
	}
	
	toGoodsDetail(id) {
	    this.props.navigator.push({
	        component: GoodsDetail,
	        hideNavBar: true,
	        passProps: {
	            id: id,
	        },
	    });
	}
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let totalAmount = 0;
		if(this.state.list) {
		    for(let item of this.state.list) {
		    	let price = ShopUtil.accMul(item.goods_price, item.goods_num);
		        totalAmount = ShopUtil.floatAdd(totalAmount, price);
		        totalAmount = totalAmount.toFixed(2);
		    }
		}
		
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
					{
						!this.state.list && !this.state.loading ? 
				    	<Message text="暂无数据" /> : null
					}
				    {
				    	!this.state.list ? null:
				    	<View style={styles.head}>
	    				    <Checkbox 
	    				        checked={this.state.checkedAll}
	    				        onCheck={this.onCheckAll.bind(this)} 
	    				    />
	    				    <TouchableOpacity onPress={() => this.onCheckAll(!this.state.checkedAll)}>
	        				    <Text>全选</Text>
	    				    </TouchableOpacity>
	    				    <Separator width={10} />
	                        <Button text="删除"
	                            size="small"
	                            stretch={false}
	    				    	style={{paddingLeft: 10, paddingRight: 10}}
	    				    	disabled={this.state.delBtnDisabled}
	                            onPress={() => this.onDelete()} 
	                        />
					    </View>
				    }
			        {
			            !this.state.list ? null : 
		                this.state.list.map((v, i) => {
		                    return this.renderRow(v, i);
		                })
			        }
				</ScrollView>
				<View style={styles.bottomNav}>
				    <View style={styles.bottomNavLeft}>
				        <Text>合计：￥{totalAmount}</Text>
				        <Text>不含运费</Text>
				    </View>
				    <View style={styles.bottomNavRight}>
				        <Button text="结算"
				            style={{borderRadius: 0}}
				            onPress={() => this.submit()} 
				        />
				    </View>
				</View>
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
			<NavBar title = '购物车' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
			/>
		);
	}
	
	renderRow(v, i) {
        return (
            <View style={styles.item} key={i}>
                <View style={styles.itemCheck}>
                    <Checkbox checked={v.checked}
                        onCheck={(checked) => this.onCheckItem(checked, i)} 
                    />
                </View>
                <TouchableOpacity
                	onPress={() => this.toGoodsDetail(v.goods_id)}
                >
                    <Image style={styles.goodsImg}
                        source={{uri: ShopUtil.ServerDomain + v.goods_image}}
                    />
                </TouchableOpacity>
                <View style={styles.goodsParam}>
                    <Text>{v.goods_name}</Text>
                    <Text style={styles.goodsPrice}>￥{v.goods_price}</Text>
                    <View style={styles.goodsNumChange}>
                        <TouchableOpacity
                            style={styles.goodsNumChangeImg}
                            onPress={() => this.onGoodsNumSub(i)}
                        >
                            <EasyIcon name='ios-remove' size={20} />
                        </TouchableOpacity>
                        <TextInput 
                            style={styles.goodsNumInput}
                            keyboardType="numeric" 
                            value={String(v.goods_num)}
                            onChangeText={(value) => {
                            	this.state.list[i].goods_num = value;
                                this.setState({
                                    list: this.state.list,
                                });
                            }}
                            onEndEditing={(value) => {
                                let num = this.state.list[i].goods_num;
                                if(num == '' || isNaN(Number(num)))
                                    num = 1;
                                this.updateGoods(this.state.list[i].cart_id, num, i);
                            }} 
                        />
                        <TouchableOpacity
                            style={styles.goodsNumChangeImg}
                            onPress={() => this.onGoodsNumAdd(i)}
                        >
                            <EasyIcon name='ios-add' size={20} />
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
	head: {
	    flexDirection: 'row',
	    alignItems: 'center',
        paddingRight: 15,
        height: 45,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	item: {
	    flexDirection: 'row',
	    paddingTop: 15,
	    paddingBottom: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
	itemCheck: {
	    justifyContent: 'center',
	},
	goodsImg: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    goodsPrice: {
        marginTop: 5,
    },
    goodsParam: {
    	flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    goodsNumChange: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        marginTop: 5,
    },
    goodsNumChangeImg: {
        backgroundColor: '#ccc',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goodsNumInput: {
        width: 40,
        height: 30,
        padding: 0,
        textAlign: 'center',
    },
    bottomNav: {
        backgroundColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
    },
    bottomNavLeft: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 15,
    },
    bottomNavRight: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default List;



