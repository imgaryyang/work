package com.lenovohit.ssm.app.el.web.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.el.model.AppCardBin;
import com.lenovohit.ssm.app.el.model.BankCards;

/**
 * 银行卡BIN管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/appCardBin")
public class CardBinRestController extends BaseRestController {

	@Autowired
	private GenericManager<AppCardBin, String> appCardBinManager;

	@Autowired
	private GenericManager<BankCards, String> bankCardsManager;

	/**
	 * 
	 * 维护银行卡BIN
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		AppCardBin model = JSONUtils.deserialize(data, AppCardBin.class);
		model = this.appCardBinManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询银行卡BIN信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		AppCardBin model = this.appCardBinManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 维护银行卡BIN信息
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		AppCardBin model = this.appCardBinManager.get(id);
		model = this.appCardBinManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 删除银行卡BIN
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		AppCardBin model = this.appCardBinManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询银行卡BIN列表
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery("from AppCardBin ");
		this.appCardBinManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	/**
	 * ELB_CARD_003 卡号规则校验 p2.1 并返回卡bin对应信息
	 * 
	 * @param cardNo
	 * @return map(cardBin,haveCard)
	 */
	@RequestMapping(value = "/checkCardNo/{cardNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result checkCardNo(@PathVariable("cardNo") String cardNo) {
		if (cardNo == null || StringUtils.isEmpty(cardNo) || "null".equals(cardNo)) {
			throw new BaseException("请输入卡号。");
		}
		String cardBinStr = cardNo.substring(0, 6);// 截取卡BIN
		String jql = " from AppCardBin c where c.cardBin=? ";
		AppCardBin cardBin = this.appCardBinManager.findOne(jql, cardBinStr);
		if (cardBin == null) {
			throw new BaseException("该卡不可绑定，请重新填写。");// 不存在该卡BIN，返回提示信息
		}
		
		return ResultUtils.renderSuccessResult(cardBin);
	}

	/**
	 * ELB_CARD_004 卡绑定-提交认证信息 p2.1.1 该功能需要调用银行接口，验证绑卡信息是否正确
	 * 
	 * @param name
	 *            /姓名；idCard/身份证号码；cardNo/卡号;bankNo/银行编号； mobile/银行预留手机号码
	 * @return
	 */
	@SuppressWarnings({"rawtypes" })
	@RequestMapping(value = "/submitInfo", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result submitInfo(@RequestBody String data) {
		Map map = JSONUtils.deserialize(data, Map.class);
		AppCardBin model = JSONUtils.deserialize(map.get("cardBin").toString(), AppCardBin.class);
		
		BankCards bankCards = new BankCards();
		bankCards.setCardHolder(ObjectIsNull(map.get("cardholder")));
		bankCards.setIdCardNo(ObjectIsNull(map.get("idCardNo")));
		bankCards.setMobile(ObjectIsNull(map.get("mobile")));
		bankCards.setCardNo(ObjectIsNull(map.get("cardNo")));
		bankCards.setPersonId(ObjectIsNull(map.get("personId")));
		
		bankCards.setBankCardType(model.getBankCardType());
		bankCards.setBankCardTypeName(model.getBankCardTypeName());
		bankCards.setBankNo(model.getBankNo());
		bankCards.setBankName(model.getBankName());
		bankCards.setOrgId(model.getOrgId());
		bankCards.setOrgName(model.getOrgName());
		bankCards.setTypeId(model.getCardTypeId());
		
		// TODO银行接口认证信息

		// TODO银行接口认证成功后，调用短信接口发送短信并记录短信认证码

		return ResultUtils.renderSuccessResult(bankCards);
	}

	public String  ObjectIsNull(Object obj){
		if(obj==null) return "";
		return obj.toString();
	}
	
}