/**
 * 等待实名认证还是返回的等待页面
 * 描述了实名之后可以通过实名卡支付的信息
 */
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
    BackAndroid,
	InteractionManager,
} from 'react-native';

import * as Global  		from '../../Global';
import NavBar       		from 'rn-easy-navbar';
import Button       		from 'rn-easy-button';

import PatientDetail 		from './PatientDetail';
import RealNameReg  		from './RealNameReg';

class WaitingPage extends Component {

    static displayName = 'WaitingPage';
    static description = '等待页面';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
	};

    constructor (props) {
        super(props);

		let routes = this.props.navigator.getCurrentRoutes();
		let route = routes[routes.length - 1];
		route.ignoreBack = true;
    }

    componentWillMount() {
        BackAndroid.removeEventListener('hardwareBackPress', ()=>{});
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar() }
                <ScrollView style = {styles.scrollView} keyboardShouldPersistTaps={true}>
                    <View style={{alignItems:'center',justifyContent:'center',marginTop:25}}>
                        <Text>注册成功后只能在挂号时使用</Text>
                        <Text>如果想要付款请进行实名认证</Text>
                    </View>
                    <View style = {{ flexDirection: 'row', margin: 5, marginTop: 20, marginBottom: 40, alignItems:'center', justifyContent:'center'}} >
                        <Button text = "不了，以后认证" theme={Button.THEME.ORANGE}  onPress={() => this.goBack() }/>
                        <Button text = "进入实名认证" theme={Button.THEME.ORANGE}  onPress={() => this.goRealName() }/>
                    </View>
                </ScrollView>
            </View>
        );
	}

    goBack() {
        let routes = this.props.navigator.getCurrentRoutes();
        this.props.navigator.popToRoute(routes[routes.length - 4]);
        this.props.fresh();
    }

    goRealName() {
        this.props.navigator.push({
			component: RealNameReg,
			hideNavBar: true,
			passProps: {
                way: true,
				userPatient: this.props.userPatient,
				card: this.props.card,
				fresh: this.props.fresh
			},
		});
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
			<NavBar title = '恭喜您，添加卡成功' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {true} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
});

export default WaitingPage;



