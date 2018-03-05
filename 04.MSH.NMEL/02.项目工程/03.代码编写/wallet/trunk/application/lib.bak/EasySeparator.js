'use strict';
/**
 * 公用分割组件
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
} from 'react-native';

class EasySeparator extends Component {

    static displayName = 'EasySeparator';
    static description = 'EasySeparator Component';

    static propTypes = {

        /**
         * 分隔宽度
         */
        width: PropTypes.number,

    	/**
    	 * 分隔高度
    	 */
    	height: PropTypes.number,

        /**
         * 背景颜色
         */
        bgColor: PropTypes.string,

    };

    static defaultProps = {
        bgColor: null,
    };

	render () {
        let bgColorStyle = this.props.bgColor ? 
            ({backgroundColor: this.props.bgColor == 'default' ? 'rgba(200, 199, 204, 1)' : this.props.bgColor}) 
            : null;
        let width = this.props.width ? {width: this.props.width} : null;
        let height = this.props.height ? {height: this.props.height} : null;
        let { style, ...other } = this.props;
		return (
			<View style = {[bgColorStyle, width, height, style]} {...other} />
		);
	}

}

export default EasySeparator;



