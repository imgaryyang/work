'use strict';
/**
 * 绑定卡 步骤样式
 */
import React, {
    Component,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import * as Global  from '../Global';
class BindStep extends Component {
    constructor (props) {
        super(props);
    }
	render () {
		let num = this.props.num;
		return (
			<View style={styles.navView}>
				<View style={styles.navNumView}><Text style={num==='1' ? styles.navNumText : styles.navText}>1.输入卡号</Text></View>
				<View style={styles.navNumView}><Text style={styles.navText}>></Text></View>
				<View style={styles.navNumView}><Text style={num==='2' ? styles.navNumText : styles.navText}>2.认证信息</Text></View>
				<View style={styles.navNumView}><Text style={styles.navText}>></Text></View>
				<View style={styles.navNumView}><Text style={num==='3' ? styles.navNumText : styles.navText}>3.验证码</Text></View>
				<View style={styles.navNumView}><Text style={styles.navText}>></Text></View>
				<View style={styles.navNumView}><Text style={num==='4' ? styles.navNumText : styles.navText}>4.完成</Text></View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	navView: {
		// flex: 2,
		height: 50,
		flexDirection : 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginLeft:30,
		marginRight:30
	},
	navNumView: {
		height:14,
		// width:14,
		// backgroundColor: Global._colors.IOS_BLUE, 
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft:7,
		marginRight:1,
	},
	navNumText: {
		// color:'#ffffff',
		color: Global.Color.ORANGE,
		fontSize: 14,
		lineHeight: 18,
	},
	navText: {
		lineHeight: 18,
		fontSize: 14,
	},
	// navSelect: {
	// 	// backgroundColor: Global._colors.ORANGE, 
	// 	color: Global._colors.ORANGE,
	// },
});

export default BindStep;

