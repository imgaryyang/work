
/*----- new arrival item -----*/

var NewArrivalItem = React.createClass({
	displayName: "NewArrivalItem",
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
			React.createElement("div", {className: "block-box na-list", ref: "naItem", onClick: this.go}, 
				React.createElement("img", {src: rootScope.$constants.naPath + d.photo.photo}), 
				React.createElement("span", {className: "logo", style: logoStyle}), 
				React.createElement("span", {className: "caption"}, d.caption), 
				React.createElement("span", {className: cls, onClick: this.showAll}, d.desc, React.createElement("i", {className: icls}))
			)
		);
	}
});




