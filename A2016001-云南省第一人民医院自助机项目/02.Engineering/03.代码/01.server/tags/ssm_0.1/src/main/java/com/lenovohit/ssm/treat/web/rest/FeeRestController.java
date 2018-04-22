package com.lenovohit.ssm.treat.web.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.payment.model.Fee;
import com.lenovohit.ssm.payment.model.HisOrder;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.manager.HisFeeManager;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.UnPayedFeeRecord;

/**
 * 缴费
 */
@RestController
@RequestMapping("/ssm/treat/fee")
public class FeeRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<Order, String> orderManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<Fee, String> feeManager;
	@Autowired
	private HisFeeManager hisFeeManager;
	
	/**
	 * 上传处方信息，通知医院，生成订单，
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateOrder(@RequestBody String data){
		Order order =  JSONUtils.deserialize(data, Order.class);
		List<Fee> fees = order.getFees();
		HisOrder hisOrder= null;//hisFeeManager.forPay(fees);//TODO 调用医院接口返回医院订单信息
		BigDecimal totalAmt = new BigDecimal(0);;
		for(Fee fee : fees){
			totalAmt = totalAmt.add(fee.getAmt()); 
			feeManager.save(fee);//保存收费明细
		}
		if(totalAmt.equals(hisOrder.getAmt())){
			//TODO 医院返回金额与自我计算金额不符
		}
		order.setHospitalNo(hisOrder.getNo());
		order.setAmt(totalAmt);
		//TODO 完善订单
		orderManager.save(order);//保存订单
		return ResultUtils.renderSuccessResult(order);
	}
	
	/**
	 * 待缴费账单查询
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(){
		Patient patient  = this.getCurrentPatient();
		List<UnPayedFeeRecord> feeList = hisFeeManager.getUnPayedFees(patient);
		return ResultUtils.renderSuccessResult(feeList);
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
	
	private Patient getCurrentPatient(){
		// 获取当前患者
		Patient patient = (Patient)this.getSession().getAttribute(SSMConstants.SSM_PATIENT_KEY);
		if(patient == null ){
		}
		return patient;
	}
	
}
