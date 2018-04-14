package com.lenovohit.hcp.outpatient.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;

import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.outpatient.model.IPacs;

/**
 * 检验查询
 */
@RestController
@RequestMapping("/hcp/app/onws/pacs")
public class IPacsRecordController extends HcpBaseRestController {
	
	/**
	 * 根据条件查询Pacs信息
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPacsResult(@RequestParam(value = "data", defaultValue = "") String data){

		IPacs query =  JSONUtils.deserialize(data, IPacs.class);
		String inpatientNo = query.getInpatientNo();
		
//		System.out.print("/hcp/app/onws/pacs==="+inpatientNo);
		IPacs iPacs = new IPacs();
		IPacs iPacs1 = new IPacs();
		List<IPacs> IPacsList = new ArrayList<IPacs>();
		

  			iPacs.setInpatientNo("1800150");
  			iPacs.setOrderNO("211");
  			iPacs.setName("B超");
  			iPacs.setPart("前列腺");
  			iPacs.setType("超声");
  			iPacs.setMemo("明早8点");
  			iPacs.setBarcode("8904007890");
  			iPacs.setIsEmergency("1");
  			iPacs.setOrderTime("2018-01-17 11:40:00");
  			iPacs.setCheckTime("2018-01-18 11:52:00");
  			iPacs.setState("已报告");
  			iPacs.setSee("腹部两侧局部回声不均");
  			iPacs.setResult("站立位左、右侧腹股沟区分别深38mm、18mm的无回声区，与腹腔相通，下级未达阴囊，平卧位可回纳。左侧睾丸大小约31x14x23mm,右侧睾丸大小约35x23x25mm，左侧睾丸上级回声分布不均。");

  			iPacs1.setInpatientNo("1800150");
  			iPacs1.setOrderNO("211");
  			iPacs1.setName("胸部正侧面DR平扫");
  			iPacs1.setPart("胸部");
  			iPacs1.setType("放射");
  			iPacs1.setMemo("");
  			iPacs1.setBarcode("8904007891");
  			iPacs1.setIsEmergency("1");
  			iPacs1.setOrderTime("2018-01-17 11:40:00");
  			iPacs1.setCheckTime("2018-01-18 11:52:00");
  			iPacs1.setState("已做检");
  			iPacs1.setSee("");
  			iPacs1.setResult("");
  			
  			IPacsList.add(iPacs);
  			IPacsList.add(iPacs1);
		
		return ResultUtils.renderSuccessResult(IPacsList);
	}
	
	/**
	 * 根据条件查询Pacs信息
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetail(@RequestParam(value = "data", defaultValue = "") String data) {
//		System.out.print("Pacsdetail===hahahahah"+data);
		IPacs query =  JSONUtils.deserialize(data, IPacs.class);
		String barcode = query.getBarcode();
		
		IPacs iPacs = new IPacs();
		if (barcode.equals("8904007890")){
			System.out.print("Pacsdetail===8904007890");
			iPacs.setInpatientNo("1800150");
			iPacs.setOrderNO("211");
			iPacs.setName("B超");
			iPacs.setPart("前列腺");
			iPacs.setType("超声");
			iPacs.setMemo("明早8点");
			iPacs.setBarcode("8904007890");
			iPacs.setIsEmergency("1");
			iPacs.setOrderTime("2018-01-17 11:40:00");
			iPacs.setCheckTime("2018-01-18 11:52:00");
			iPacs.setState("已报告");
			iPacs.setSee("new_腹部两侧局部回声不均");
			iPacs.setResult("new_站立位左、右侧腹股沟区分别深38mm、18mm的无回声区，与腹腔相通，下级未达阴囊，平卧位可回纳。左侧睾丸大小约31x14x23mm,右侧睾丸大小约35x23x25mm，左侧睾丸上级回声分布不均。");
			
			return ResultUtils.renderSuccessResult(iPacs);
		}else{
//			return ResultUtils.renderSuccessResult(iPacs);
			return ResultUtils.renderFailureResult("暂无特检结果！");
		}
  			
	}


}
