import { Component } from 'react';
import { connect } from 'dva';

class PaymentHome extends Component {
  render(){
    return(
      <div style = {{textAlign:'left', width:'400px',margin:'auto', fontSize:'15px'}} >
        <p>程序员甲：哎，借我点钱呗？</p>
        <p>程序员乙：借多少？</p>
        <p>程序员甲：1000。</p>
        <p>程序员乙：行。哎，要不要多借你 24，好凑个整？</p>
        <p>程序员甲：也好。</p>
      </div>
    )
  }
}
export default  connect()(PaymentHome);