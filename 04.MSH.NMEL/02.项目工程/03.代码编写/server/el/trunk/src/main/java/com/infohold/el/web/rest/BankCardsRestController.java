package com.infohold.el.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.org.model.Person;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.ElConstants;
import com.infohold.el.base.model.BankCards;
import com.infohold.el.base.model.CardType;
import com.infohold.el.base.model.User;

/**
 * 银行卡（二代社保卡/健康卡）管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/bankCards")
public class BankCardsRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<BankCards, String> bankCardsManager;
	
	@Autowired
	private GenericManager<CardType, String> cardTypeManager;

	@Autowired
	private GenericManager<User, String> userManager;
	
	@Autowired
	private GenericManager<Person, String> personManager;
	
	/**
	 * 
	 * 维护银行卡（二代社保卡/健康卡）信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		BankCards model = new BankCards();
		model = JSONUtils.deserialize(data, BankCards.class);
		model = this.bankCardsManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_CARD_009 查询银行卡（二代社保卡/健康卡）信息
	 * ELB_CARD_001	查询用户工资卡基本信息	p1.1
	 * 根据传入的类型查询对应的卡详情，银行卡/二代社保卡/健康卡/就诊卡
	 * @param id
	 * @return
	 * typeId/卡种ID；cardNo/银行卡号；cardholder/持卡人姓名；bankOrgId/银行机构ID；ankNo/银行行号；
	 * bankName/银行行名；cardType/卡类型【1 - 储蓄卡 2 - 信用卡】；balance/余额；
	 * orgId/联合发卡机构ID；orgName/联合发卡机构名称；idCardNo/身份证号；bindedAt/绑卡时间
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		BankCards model = this.bankCardsManager.get(id);
		CardType cardType = this.cardTypeManager.get(model.getTypeId());
		model.setCardType(cardType);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 维护银行卡（二代社保卡/健康卡）信息
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		BankCards model = this.bankCardsManager.get(id);
		model = this.bankCardsManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_CARD_006 解除绑定 
	 * 删除银行卡（二代社保卡/健康卡） 需先校验支付密码才能完成解绑
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/delBindCard/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		
		//支付密码验证成功后，对卡进行解绑，逻辑删除，更改状态 state=2
		BankCards model  = this.bankCardsManager.get(id);
		model .setState("2");
		model.setUnbindedAt(DateUtils.getCurrentDateTimeStr());
		this.bankCardsManager.save(model);
		//解绑成功后返回状态
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_CARD_002 查询银行卡（二代社保卡/健康卡）列表  P2
	 * 根据传入的类型筛选所有绑定的卡，如果未传类型，则返回所有卡，包括普通银行卡、二代社保卡、健康卡、就诊卡
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Map map = JSONUtils.deserialize(data, Map.class);
		String personId = ObjectIsNull(map.get("personId"));
		
		String jql = "from BankCards b,CardType c where b.typeId=c.id and b.state=1 and b.personId = ? ";
		List<Object[]> list = (List<Object[]>)bankCardsManager.findByJql(jql, personId);
		jql += " order by b.typeId ";
		
		List<BankCards> bankCards = new ArrayList<BankCards>();
		BankCards bankcard = null;
		CardType cardType = null;
		for(Object[] obj : list){
			bankcard = (BankCards)obj[0];
			cardType = (CardType)obj[1];
			if(bankcard!=null){
				bankcard.setCardType(cardType);
				bankCards.add(bankcard);
			}
		}
		
		return ResultUtils.renderSuccessResult(bankCards);
	}
	
	/**
	 * ELB_CARD_005 卡绑定-保存绑卡信息
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/submitInfo", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result checkVerifyCode(@RequestBody String data) {
		
		Map map = JSONUtils.deserialize(data, Map.class);
		BankCards bankCards = JSONUtils.deserialize(map.get("bankCards").toString(), BankCards.class);
		
		//TODO 记录实名认证信息
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		_user = this.userManager.get(_user.getId());
		if(null!=_user && StringUtils.isBlank(_user.getPersonId())){
			Person person = new Person();
			person.setName(bankCards.getCardHolder());
			person.setIdNo(bankCards.getIdCardNo());
			person.setIdType("01");
			person.setGender(_user.getGender());
			person.setMail(_user.getEmail());
			person.setMobile(_user.getMobile());
			person.setSiId(_user.getSiId());
			person.setStatus("1");
			person = this.personManager.save(person);
			
			_user.setPersonId(person.getId());
			_user.setName(bankCards.getCardHolder());
			_user.setIdCardNo(bankCards.getIdCardNo());
			this.userManager.save(_user);
		}
		
		
		//判断该卡是否已经绑定过 ，如果绑定过更新信息
		String jql = " from BankCards b where b.cardNo=? ";
		BankCards bankCardsNew = bankCardsManager.findOne(jql, bankCards.getCardNo());
		if(null != bankCardsNew){
			bankCards.setId(bankCardsNew.getId());
			bankCards.setUnbindedAt(null);
		}
		bankCards.setBindedAt(DateUtils.getCurrentDateTimeStr());
		bankCards.setState("1");
		bankCards.setPersonId(_user.getPersonId());
		bankCards = this.bankCardsManager.save(bankCards);

		CardType cardType = this.cardTypeManager.get(bankCards.getTypeId());
		bankCards.setCardType(cardType);
		return ResultUtils.renderSuccessResult(bankCards);
	}

	/**
	 * ELB_CARD_*** 判断该卡是否存在以及状态
	 * 根据传入的卡号查询对应的卡详情
	 * @param cardNo
	 * @return
	 */
	@RequestMapping(value = "/getCardFoCardNo/{cardNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getCardFoCardNo(@PathVariable("cardNo") String cardNo) {
		BankCards bankCards = bankCardsManager.findOne("from BankCards b where b.cardNo=? ", cardNo);
		if(bankCards != null){
			CardType cardType = this.cardTypeManager.get(bankCards.getTypeId());
			bankCards.setCardType(cardType);
		}
		
		return ResultUtils.renderSuccessResult(bankCards);
	}

	public String  ObjectIsNull(Object obj){
		if(obj==null) return "";
		return obj.toString();
	}
	
}
