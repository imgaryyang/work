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
	Animated,
} from 'react-native';

import ShopStore   from '../../flux/ShopStore';
import ShopAction   from '../../flux/ShopAction';
import ShoppingCartList   from '../shoppingCart/List';
import UserHome   from '../user/UserHome';

class TopNavBarRightButtons extends Component {

    static displayName = 'TopNavBarRightButtons';
    static description = '商城导航栏右侧按钮';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		num: ShopStore.getShoppingCartNum(),
		fadeAnim: new Animated.Value(1),
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		ShopStore.listen(this.onShoppingCartChange.bind(this));
	}
	
	onShoppingCartChange(num) {
		this.setState({num});
		Animated.sequence([
		   	Animated.timing(
		   		this.state.fadeAnim,
		   		{toValue: 0.1, duration: 300}
		    ),
		    Animated.timing(
				this.state.fadeAnim,
		   		{toValue: 1, duration: 300}
		    )      
		]).start();
	}
	
	startAnimation() {
		Animated.sequence([
           	Animated.timing(
           		this.state.fadeAnim,
           		{toValue: 2, duration: 200}
		    ),
		    Animated.timing(
				this.state.fadeAnim,
           		{toValue: 1}
		    )      
		]).start();
	}
	
	toShoppingCartList() {
		this.props.navigator.push({
            component: ShoppingCartList,
            hideNavBar: true,
        });
	}

	toUserHome() {
		this.props.navigator.push({
            component: UserHome,
            hideNavBar: true,
        });
	}

	render () {
		return (
			<View style={styles.container}>
				{
					!this.props.showShoppingCart ? null :
						<TouchableOpacity style={styles.item}
										  onPress={() => this.toShoppingCartList()}>
							<Image source={require('../images/nav_ShoppingCart.png')} style={styles.img} />
							{
								!this.state.num || this.state.num == 0 ? null :
									<Animated.View style={[styles.circle, {opacity: this.state.fadeAnim}]}>
										<Text style={styles.cji}>{this.state.num > 99 ? '99+' : this.state.num}</Text>
									</Animated.View>
							}
						</TouchableOpacity>
				}
				{
					!this.props.showMyOrder ? null :
						<TouchableOpacity style={styles.item}
                            onPress={() => this.toUserHome()}
                        >
							<Image source={require('../images/nav_Order.png')} style={styles.img} />
						</TouchableOpacity>
				}
	    	</View>
		);
	}

}

export default TopNavBarRightButtons;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
	},
	item: {
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
	},
	itemText: {
		color: '#fff',
	},
	circle: {
		top: 6,
		right: 6,
		position: 'absolute',
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#fff100',
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.9,
	},
	cji: {
		fontSize: 8,
		color: '#f54646',
	},
	img: {
		width: 23,
		height: 20,
		resizeMode: 'contain',
	},
});



