package com.lenovohit.hwe.treat.web.his;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.datatype.DatatypeConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Charge;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.model.Deposit;
import com.lenovohit.hwe.treat.service.HisChargeDetailService;
import com.lenovohit.hwe.treat.service.HisChargeService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/his/charge/")
public class ChargeHisController extends OrgBaseRestController {

	@Autowired
	private HisChargeDetailService hisChargeDetailService;
	
	@Autowired
	private HisChargeService hisChargeService;
	
	@Autowired
	private GenericManager<Charge, String> chargeManager;
	
	@Autowired
	private GenericManager<ChargeDetail, String> chargeDetailManager;
	
	/**
	 * 缴费记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		ChargeDetail chager = JSONUtils.parseObject(data, ChargeDetail.class);
		RestListResponse<ChargeDetail> response = this.hisChargeDetailService.findList(chager);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	

	@RequestMapping(value = "prepay", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPrepay(@RequestBody String data) {
		Charge charge =  JSONUtils.deserialize(data, Charge.class);
		System.out.println("==============自费预结算开始===================");
		// 调用HIS接口
		RestEntityResponse<Charge> response = this.hisChargeService.prepay(charge);
		System.out.println("==============自费预结算结束===================");
		if(response.isSuccess()) {
			Charge resCharge = response.getEntity();
			// 1.保存缴费记录数据 
//			resCharge.setStatus("A");
//			chargeManager.save(resCharge);
			
			// 2.保存缴费明细数据
			for (int idx = 0; idx < charge.getItems().size(); idx++) {
				ChargeDetail chargeDetail = charge.getItems().get(idx);
				chargeDetail.setStatus("A");
				chargeDetail.setChargeNo(resCharge.getNo());
				chargeDetailManager.save(chargeDetail);
				
				if (idx == 0) {
					charge.setDepId(chargeDetail.getDepId());
					charge.setDepNo(chargeDetail.getDepNo());
					charge.setDepName(chargeDetail.getDepName());
					charge.setDocId(chargeDetail.getDocId());
					charge.setDocNo(chargeDetail.getDocNo());
					charge.setDocName(chargeDetail.getDocName());
					charge.setDocJobTitle(chargeDetail.getDocJobTitle());
					charge.setStatus("A");
					charge.setChargeUser(charge.getTerminalUser());
					charge.setChargeTime(resCharge.getChargeTime());	
					charge.setNo(resCharge.getNo());
					chargeManager.save(charge);

				}
			}
			return ResultUtils.renderSuccessResult(response.getEntity());
		}
		else { 
			Charge resCharge = response.getEntity();
			// 2.保存缴费明细数据
			for (int idx = 0; idx < charge.getItems().size(); idx++) {
				ChargeDetail chargeDetail = charge.getItems().get(idx);
				chargeDetail.setStatus("1");
				chargeDetailManager.save(chargeDetail);
				
				if (idx == 1) {
					charge.setDepId(chargeDetail.getDepId());
					charge.setDepNo(chargeDetail.getDepNo());
					charge.setDepName(chargeDetail.getDepName());
					charge.setDocId(chargeDetail.getDocId());
					charge.setDocNo(chargeDetail.getDocNo());
					charge.setDocName(chargeDetail.getDocName());
					charge.setDocJobTitle(chargeDetail.getDocJobTitle());
					charge.setStatus("1");
					charge.setChargeUser(charge.getTerminalUser());
					charge.setChargeTime(new Date());	
					chargeManager.save(charge);
				}
			}
			return ResultUtils.renderFailureResult(response.getMsg());
		}
	}
	
	@RequestMapping(value = "pay", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPay(@RequestBody String data) {
		Charge charge =  JSONUtils.deserialize(data, Charge.class);
		if (charge.getHosNo() == null || charge.getHosNo().equals("") || 
			charge.getNo() == null || charge.getNo().equals("")) {
			return ResultUtils.renderFailureResult("数据错误");
		}
	
		System.out.println("==============自费结算开始===================");
		// 调用HIS接口
		RestEntityResponse<Charge> response = this.hisChargeService.pay(charge);
		System.out.println("==============自费结算结束===================");
		if(response.isSuccess()) {
			// 根据医院id和收费单号更新
			// 1.更新缴费记录
			StringBuilder chargeSql = new StringBuilder("from Charge where 1=1 and hosNo = ? and no = ?");
			List<Object> chargeValues = new ArrayList<Object>();
			chargeValues.add(charge.getHosNo());
			chargeValues.add(charge.getNo());
			Charge findCharge = chargeManager.findOne(chargeSql.toString(), chargeValues.toArray());
			findCharge.setStatus(response.getEntity().getStatus());
			findCharge.setMyselfScale(response.getEntity().getMyselfScale());
			findCharge.setAmt(response.getEntity().getAmt());
			findCharge.setRealAmt(response.getEntity().getRealAmt());
			findCharge.setMiAmt(response.getEntity().getMiAmt());
			findCharge.setPaAmt(response.getEntity().getPaAmt());
			findCharge.setMyselfAmt(response.getEntity().getMyselfAmt());
			findCharge.setReduceAmt(response.getEntity().getReduceAmt());
			chargeManager.save(findCharge);
			
			// 2.更新缴费明细数据			
			StringBuilder chargeDetailSql = new StringBuilder("from ChargeDetail where 1=1 and hosNo = ? and chargeNo = ?");
			List<Object> chargeDetailValues = new ArrayList<Object>();
			chargeDetailValues.add(charge.getHosNo());
			chargeDetailValues.add(charge.getNo());
			List<ChargeDetail> findChargeDetails = chargeDetailManager.find(chargeDetailSql.toString(), chargeDetailValues.toArray());
			for (ChargeDetail item : findChargeDetails) {
				item.setStatus("0");
				chargeDetailManager.save(item);
			}
			// 2.更新缴费明细
			return ResultUtils.renderSuccessResult(response.getEntity());
		}
		else {
			return ResultUtils.renderFailureResult(response.getMsg());
		}
	}
}
