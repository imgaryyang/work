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
} from 'react-native';

import NavBar       from 'rn-easy-navbar';
import * as Global  from '../../Global';
import * as ShopUtil from '../util/ShopUtil';

class AreaList extends Component {

    static displayName = 'AreaList';
    static description = '地区选择';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		list: false,
	};

    constructor (props) {
        super(props);
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
	    let areaId = this.props.areaId || 0;
        let url = `${ShopUtil.ServerUrl}?act=app&op=area&area_id=${areaId}`;
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
                doRenderScene: true,
                list: responseData.root,
            });
            this.hideLoading();
        } catch(e) {
        	this.hideLoading();
            this.handleRequestException(e);
        }
    }
	
	onPress(v) {
	    let areaSelectedArr = this.props.areaSelectedArr;
	    if(!areaSelectedArr)
	        areaSelectedArr = [];
	    areaSelectedArr.push(v);

	    if (v.area_deep == '3') {
	        let currentRoutes = this.props.navigator.getCurrentRoutes();
            let currentRoute = null;
            for (let i = currentRoutes.length - 1; i >= 0; i--) {
                if (currentRoutes[i].component.displayName == this.props.displayName) {
                    this.props.navigator.popToRoute(currentRoutes[i]);
                    break;
                }
            }
            this.props.refreshFn && this.props.refreshFn(areaSelectedArr);
        } else {
            this.props.navigator.push({
                component: AreaList,
                hideNavBar: true,
                passProps: {
                    areaId: v.area_id,
                    areaSelectedArr: areaSelectedArr,
                    refreshFn: this.props.refreshFn,
                    displayName: this.props.displayName,
                },
            });
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
				        !this.state.list ? null : 
			            this.state.list.map((v, i) => {
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
			<NavBar title = '地区选择' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false}
			/>
		);
	}
	
	renderRow(v, i) {
	    return (
            <TouchableOpacity style={styles.item}
                onPress={() => this.onPress(v)}
            >
                <Text>{v.area_name}</Text>
            </TouchableOpacity>
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
        paddingLeft: 15,
        paddingRight: 15,
        height: 45,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
	},
});

export default AreaList;



