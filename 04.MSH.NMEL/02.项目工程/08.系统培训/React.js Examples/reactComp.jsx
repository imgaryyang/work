
/*----- new arrival item -----*/

var NewArrivalItem = React.createClass({
	getInitialState: function () {
        return {
            showAllDesc: false
        };
    },
    showAll: function (e) {
    	//console.log('in [showAll]:', e.target);
    	this.setState({
    		showAllDesc: !this.state.showAllDesc
    	});
    	e.stopPropagation();
    },
    go: function (e) {
    	//console.log('in [go]:', e.target);
    	this.props.rootScope.go('info', {id: this.props.data.id});
    },
	render: function () {
		var d = this.props.data;
		var rootScope = this.props.rootScope;
		
		var logoStyle = {
			backgroundImage: 'url(' + rootScope.$constants.brandLogoPath + d.brand.logo + ')'
		};
		var cls = this.state.showAllDesc ? 'ion desc show-all' : 'ion desc';
		var icls = this.state.showAllDesc ? 'ion-up' : 'ion-down';
		return (
			<div className="block-box na-list" ref="naItem" onClick={this.go}>
				<img src={rootScope.$constants.naPath + d.photo.photo} />
				<span className="logo" style={logoStyle}></span>
				<span className="caption">{d.caption}</span>
				<span className={cls} onClick={this.showAll}>{d.desc}<i className={icls}></i></span>
			</div>
		);
	}
});



