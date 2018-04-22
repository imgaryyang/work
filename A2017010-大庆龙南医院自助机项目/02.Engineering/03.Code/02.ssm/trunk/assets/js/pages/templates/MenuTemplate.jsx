import React, { PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import printer from '../../utils/printUtil.jsx'; 
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
// import PrintWin from '../components/PrintWin.jsx';

import Template0 from './template0/Template.jsx';
import Template1 from './template1/Template.jsx';
import Template2 from './template2/Template.jsx';
import Template3 from './template3/Template.jsx';
import Template4 from './template4/Template.jsx';
import Template5 from './template5/Template.jsx';
import Template6 from './template6/Template.jsx';
const TPLS = [
  Template0,
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
]; 

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.getTpl = this.getTpl.bind(this);
    this.selectMenu = this.selectMenu.bind(this);
  }
  getTpl(){
	  const { menu } = this.props;
    const { template } = menu;
	  for(var tpl of TPLS){
		  if(tpl.code == template){
			  return tpl.cmp;
		  }
	  }
  }
  selectMenu(menu){
    if (this.props.onSelect) this.props.onSelect(menu);
  }
  render() {
	  const { menu } = this.props;
	  const CMP = this.getTpl() || Template0.cmp;
	  return <CMP menu={menu} onSelect={this.selectMenu}/>
  }
}
  
module.exports = Template;