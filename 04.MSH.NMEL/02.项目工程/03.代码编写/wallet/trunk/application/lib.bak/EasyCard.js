'use strict';
/**
 * 公用Card组件
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    StyleSheet,
    PixelRatio,
} from 'react-native';

class EasyCard extends Component {

    static displayName = 'EasyCard';
    static description = 'EasyCard Component';

    static propTypes = {

    	/**
    	 * 是否全宽度，全宽度指父容器无paddingLeft及paddingRight
    	 * card占满父容器宽度100%，此种情况下card无左、右边框线
    	 */
    	fullWidth: PropTypes.bool,

    	/**
    	 * 圆角尺寸
    	 */
    	radius: PropTypes.number,

    	/**
    	 * 是否隐藏上边框
    	 */
    	hideTopBorder: PropTypes.bool,

    	/**
    	 * 是否隐藏下边框
    	 */
    	hideBottomBorder: PropTypes.bool,

        /**
         * 清除内边距
         */
        noPadding: PropTypes.bool,

    };

    static defaultProps = {
    	fullWidth: false,
    	radius: 0,
    	hideTopBorder: false,
    	hideBottomBorder: false,
        noPadding: false,
    };

	state = {
	};

    constructor (props) {
        super(props);
    }

	render () {
		let fwStyle = this.props.fullWidth ? {borderLeftWidth: 0, borderRightWidth: 0} : null;
		let htbStyle = this.props.hideTopBorder ? {borderTopWidth: 0} : null;
		let hbbStyle = this.props.hideBottomBorder ? {borderBottomWidth: 0} : null;
		let rStyle = this.props.radius ? {borderRadius: this.props.radius} : null;

		let { style, fullWidth, hideTopBorder, hideBottomBorder, ...other } = this.props;

        style = typeof style == 'array' ? style : [style];

		return (
			<View style = {[styles.card, fwStyle, htbStyle, hbbStyle, rStyle, (this.props.noPadding ? {} : styles.dftPadding)].concat(style)} {...other} >
				{this.props.children}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#ffffff',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: '#dcdce1',
	},
    dftPadding: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
    },
});

export default EasyCard;



