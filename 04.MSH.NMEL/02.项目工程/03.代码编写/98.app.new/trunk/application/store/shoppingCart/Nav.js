'use strict';

import React, {
    Component,
    
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
import ShoppingCartList   from './List';

class Nav extends Component {

    static displayName = 'ShoppingCartNav';
    static description = '购物车导航';

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
	
	render () {
		return (
			<View style={styles.container}>
	    		<TouchableOpacity style={styles.item}
	    			onPress={() => this.toShoppingCartList()}>
	    			<Text style={styles.itemText}>购物车</Text>
	    			{
	    				!this.state.num || this.state.num == 0 ? null : 
    					<Animated.View style={[styles.circle, {opacity: this.state.fadeAnim}]}>
	    					<Text style={styles.cji}>{this.state.num > 99 ? '99+' : this.state.num}</Text>
	    				</Animated.View>
	    			}
	    		</TouchableOpacity>
	    	</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
    },
    item: {
    	paddingLeft: 15,
    	paddingRight: 15,
		justifyContent: 'center',
    },
    itemText: {
    	color: '#fff',
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ff2304',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
    },
    cji: {
        fontSize: 8,
        color: '#fff',
    },
});

export default Nav;



