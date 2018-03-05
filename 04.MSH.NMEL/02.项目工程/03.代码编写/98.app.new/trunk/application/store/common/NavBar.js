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

// import EasyIcon     	from 'rn-easy-icon';
import Index 			from '../Index';
import UserHome 		from '../user/UserHome';

class NavBar extends Component {

    static displayName = 'NavBar';
    static description = '商城底部导航';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
    };

    constructor (props) {
        super(props);
    }

    componentDidMount () {
    }
    
    toHome() {
        let currentRoutes = this.props.navigator.getCurrentRoutes();
        let currentRoute = null;
        for (let i = currentRoutes.length - 1; i >= 0; i--) {
            if (currentRoutes[i].component.displayName == Index.displayName) {
                this.props.navigator.popToRoute(currentRoutes[i]);
                break;
            }
        }
    }
    
    toNewGoodsList() {
        this.props.navigator.push({
            component: OrderList,
            hideNavBar: true
        });
    }

    toOrderList() {
        this.props.navigator.push({
            component: UserHome,
            hideNavBar: true
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.home}
                    onPress={this.toHome.bind(this)}
                >
                    <EasyIcon name="md-home" size={25} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}
                    onPress={this.toNewGoodsList.bind(this)}
                >
                    <Text>最新商品</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}
                    onPress={this.toOrderList.bind(this)}
                >
                    <Text>我的订单</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#ccc',
    },
    home: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftColor: '#fff',
        borderLeftWidth: 1
    },
});

export default NavBar;



