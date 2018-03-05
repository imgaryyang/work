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
} from 'react-native';

// import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import * as Global  from '../../Global';
import BottomNavBar from '../common/NavBar';
import OrderList    from './OrderList';
import AddressList  from './AddressList';

class UserHome extends Component {

    static displayName = 'UserHome';
    static description = '个人中心';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
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
	
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
				    <View style={styles.header}>
				        <Image source={require('../images/user-photo.png')}
				            style={styles.userPhoto}
				        />
				        <Text style={styles.userName}>刘德华</Text>
				    </View>
				    <TouchableOpacity style={styles.menu}
				        onPress={() => this.toOrderList(null)}
				    >
				        <Text>全部订单</Text>
				        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
				    </TouchableOpacity>
			        <TouchableOpacity style={styles.menu}
                        onPress={() => this.toOrderList('10')}
			        >
                        <Text>待付款</Text>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu}
                        onPress={() => this.toOrderList('20')}
                    >
                        <Text>待发货</Text>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu}
                        onPress={() => this.toOrderList('30')}
                    >
                        <Text>待收货</Text>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu}
                        onPress={() => this.toOrderList('40')}
                    >
                        <Text>已完成</Text>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu}
                        onPress={() => this.toAddressList()}
                    >
                        <Text>管理收货地址</Text>
                        <EasyIcon color="#ccc" name="ios-arrow-forward" size={25} />
                    </TouchableOpacity>
				</ScrollView>
				<BottomNavBar navigator={this.props.navigator} />
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
			<NavBar title = '个人中心' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	header: {
	    flexDirection: 'row',
	    padding: 15,
	    alignItems: 'center',
	    borderBottomColor: '#ccc',
	    borderBottomWidth: 1,
	},
	userPhoto: {
	    width: 50,
	    height: 50,
	    borderRadius: 25,
        resizeMode: 'cover',
	},
	userName: {
	    marginLeft: 10
	},
	menu: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    height: 45,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default UserHome;



