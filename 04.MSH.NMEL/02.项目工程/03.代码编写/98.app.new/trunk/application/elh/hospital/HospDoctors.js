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
	ListView,
} from 'react-native';

import * as Global  		from '../../Global';
import Card       			from 'rn-easy-card';
import Separator    		from 'rn-easy-separator';
import Portrait     		from 'rn-easy-portrait';
import {B, I, U, S} 		from 'rn-easy-text';

import Doctor     			from './HospDoctor';
import RegisterResource  	from '../register/RegisterResource';

import PropTypes from 'prop-types';
const FIND_URL 		= 'elh/doctor/app/list/';
const IMAGES_URL 	= 'el/base/images/view/';

class HospDoctors extends Component {

    static displayName = 'HospDoctors';
    static description = '医生';

    static propTypes = {
    	/**
    	 * 是否只显示专家
    	 */
    	isExpert: PropTypes.bool,
    };

    static defaultProps = {
    };

	state = {
		start: 0,
		pageSize: 10,
		dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);
        this.fetchData 			= this.fetchData.bind(this);
        this.refresh 			= this.refresh.bind(this);
        this.pullToRefresh 		= this.pullToRefresh.bind(this);
        
        this.renderRow 			= this.renderRow.bind(this);
        this.renderSeparator 	= this.renderSeparator.bind(this);

        this.onPressDetail 		= this.onPressDetail.bind(this);
        this.onPressRegister 	= this.onPressRegister.bind(this);
    }

	componentDidMount () {
		this.refresh();
	}

	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	pullToRefresh () {
		//console.log('HospDoctors:pullToRefresh');
		this.setState({
			_pullToRefreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		try {
			let cond = {
	            hospitalId: this.props.hosp.id,
	        };
	        if(this.props.isExpert === true)
	        	cond['isExpert'] = true;

			let data = encodeURI(JSON.stringify(cond));

			let responseData = await this.request(Global._host + FIND_URL 
				+ this.state.start + "/" + this.state.pageSize  + '?data=' + data, {
				method : "GET"
			});
			//console.log(responseData);
			if(responseData.result && responseData.result.length > 0) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.result),
				})
			}

			if (typeof this.props.onChildCompLoaded == 'function')
				this.props.onChildCompLoaded();

		} catch(e) {
			this.handleRequestException(e);
		}
	}


	render () {
		//console.log(this.state.dataSource);
		let emptyView = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr && !this.state.dataSource._dataBlob ? (
			<Card fullWidth = {true} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 30}]} >暂无医生信息</Text>
			</Card>
		) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				{this.getLoadingView('正在查询医生信息...', this.refresh)}
				{emptyView}
				<ListView 
					dataSource = {this.state.dataSource}
					renderRow = {this.renderRow}
					renderSeparator = {this.renderSeparator}
					style = {styles.list}
				/>
			</View>
		);
	}

	renderRow (row, sectionID, rowID, highlightRow) {

		let portraitSource = row.portrait ? 
			{uri: Global._host + IMAGES_URL + row.portrait,} :
			require('../../res/images/hosp/doctors/default.png');

		return (
			<TouchableOpacity onPress = {() => this.onPressDetail(row)} >
				<Card radius = {6} style = {{margin: 8, marginTop: 16, marginBottom: 0}} >
					<View style = {[{flexDirection: 'row'}]} >
						<Portrait imageSource = {portraitSource} bgColor = {Global._colors.IOS_GRAY_BG} width = {50} height = {50} radius = {25} />
						<View style = {{flex: 1, paddingLeft: 10}} >
							<View style = {{flexDirection: 'row'}} >
								<Text style = {{flex: 1}} ><B>{row.name}</B></Text>
								<Text style = {{flex: 1, textAlign: 'right', marginRight: 8}}><B>科室 : </B>{row.deptName}</Text>
							</View>
							<Text style = {[Global._styles.GRAY_FONT, {marginTop: 12}]} ><B>职称 : </B>{row.jobTitle}</Text>
							<Text style = {[Global._styles.GRAY_FONT, {marginTop: 5, lineHeight: 17}]} ><B>专长 : </B>{row.speciality}</Text>
						</View>
					</View>
					<View style = {{borderTopWidth: 1 / Global._pixelRatio, borderTopColor: Global._colors.IOS_SEP_LINE, marginTop: 10, paddingTop: 10, paddingLeft: 8}} >
						<Text><B>常规出诊时间 : </B></Text>
						<Text style = {[Global._styles.GRAY_FONT, {marginTop: 5}]} >{row.clinicDesc}</Text>
						{/*<Button stretch = {false} theme = {Button.THEME.ORANGE} onPress = {() => this.onPressRegister(row)} style = {{width: 70, height: 25, position: 'absolute', top: 0, right: 10, borderRadius: 0}} >
							<Text style = {{fontSize: 12, color: 'white'}} >去挂号</Text>
						</Button>*/}
					</View>
				</Card>
			</TouchableOpacity>
		);
	}

	renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
		return (
			<Separator key = {rowID} height = {10} />
		)
	}

	onPressDetail (doc) {
		this.props.navigator.push({
			component: Doctor,
			hideNavBar: true,
			passProps: {
				doc: doc
			}
		});
	}

	/**
	 * 导向到预约挂号
	 */
	onPressRegister (doc) {
		this.props.navigator.push({
        	title: '挂号',
            component: RegisterResource,
            hideNavBar: true,
			passProps: {
				hospitalId: doc.hospitalId,
				departmentId: doc.departmentId,
			}
        });
	}

}

const styles = StyleSheet.create({
	list: {
		paddingBottom: 40,
	},
});

export default HospDoctors;



