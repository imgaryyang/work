package com.infohold.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.org.model.Person;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.BankCards;
import com.infohold.el.base.model.CardBin;
import com.infohold.el.base.model.CardType;
import com.infohold.elh.base.model.MedicalCard;
import com.infohold.elh.base.model.Patient;
import com.infohold.elh.base.model.UserPatient;


/**
 * 常用就诊人就诊卡管理
 * 
 * @author 乔文全
 *
 */
@RestController
@RequestMapping("/elh/medicalCard")
public class MedicalCardRestController extends BaseRestController implements ApplicationContextAware {
	@Autowired
	private GenericManager<MedicalCard, String> medicalCardManager;
	@Autowired
	private GenericManager<BankCards, String> bankCardsManager;
	@Autowired
	private GenericManager<CardType, String> cardTypeManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<CardBin, String> cardBinManager;
	@Autowired
	private GenericManager<Person, String> personManager;
	
	/******************************************************就诊卡app方法*************************************************************************/
	/**
	 * ELH_BASE_*** 保存常用就诊人社保卡、健康卡信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "my/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		List<String> values = new ArrayList<String>();
		MedicalCard medicalCard = JSONUtils.deserialize(data.toString(), MedicalCard.class);
		// 判断卡号是否符合规则
		String bankinfo = "from CardBin cb,CardType ct where cb.cardTypeId=ct.id and cb.cardTypeId=? and substring(cb.cardBin,1,6)= ? ";
		@SuppressWarnings("unchecked")
		List<CardBin> bankinfolist = (List<CardBin>) this.cardBinManager
				.findByJql(bankinfo, medicalCard.getTypeId(), medicalCard.getCardNo().substring(0, 6));
		if (bankinfolist == null || bankinfolist != null
				&& bankinfolist.size() <= 0) {
			return ResultUtils.renderFailureResult("卡号不正确， 请确认后重试");
		}
		//判断该卡是否存在
		String hql = "from MedicalCard t where t.patientId=? and t.typeId=? and t.cardNo=? and t.orgId=? and state='1'";
		values.add(medicalCard.getPatientId());
		values.add(medicalCard.getTypeId());
		values.add(medicalCard.getCardNo());
		values.add(medicalCard.getOrgId());
		MedicalCard oldMedicalCard = this.medicalCardManager.findOne(hql, values.toArray());
		if(oldMedicalCard!=null){
			if(oldMedicalCard.getState()!="1"){
				oldMedicalCard.setState("1");
				medicalCard = this.medicalCardManager.save(oldMedicalCard);
			}else{
				throw new BaseException("该卡已经绑定。");
			}
			//medicalCard.setId(oldMedicalCard.getId());
		}else{
			medicalCard.setBindedAt(DateUtils.getCurrentDateTimeStr());
			medicalCard = this.medicalCardManager.save(medicalCard);
		}
		return ResultUtils.renderSuccessResult(medicalCard);
	}
	
	/**
	 * ELH_BASE_*** 保存常用就诊人就诊卡信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "my/createhoscard", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateHosCard(@RequestBody String data) {
		List<String> values = new ArrayList<String>();
		MedicalCard medicalCard = JSONUtils.deserialize(data.toString(), MedicalCard.class);
		//判断该卡是否存在
		String hql = "from MedicalCard t where t.patientId=? and t.typeId=? and t.cardNo=? and t.orgId=? and state='1'";
		values.add(medicalCard.getPatientId());
		values.add(medicalCard.getTypeId());
		values.add(medicalCard.getCardNo());
		values.add(medicalCard.getOrgId());
		MedicalCard oldMedicalCard = this.medicalCardManager.findOne(hql, values.toArray());
		if(oldMedicalCard!=null){
			if(oldMedicalCard.getState()!="1"){
				oldMedicalCard.setState("1");
				medicalCard = this.medicalCardManager.save(oldMedicalCard);
			}else{
				throw new BaseException("该卡已经绑定。");
			}
			//medicalCard.setId(oldMedicalCard.getId());
		}else{
			medicalCard.setBindedAt(DateUtils.getCurrentDateTimeStr());
			medicalCard = this.medicalCardManager.save(medicalCard);
		}
		return ResultUtils.renderSuccessResult(medicalCard);
	}

	/**
	 * ELH_BASE_*** 查询常用就诊人就诊卡信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		MedicalCard medicalCard = this.medicalCardManager.get(id);
		return ResultUtils.renderSuccessResult(medicalCard);
	}
	
	/**
	 * ELH_BASE_*** 根据用户ID查询常用就诊人就诊卡信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/user/{userid}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCardInfo(@PathVariable("userid") String userid) {
		UserPatient userPatient = this.userPatientManager.findOne("from"
				+ " UserPatient where userId = ?", userid);
		
		List<String> cd = new ArrayList<String>();
		cd.add(userPatient.getId());
		cd.add("0");
		cd.add("1");
		MedicalCard medicalCard = this.medicalCardManager.findOne("from"
				+ " MedicalCard where patientId = ? and typeId = ? and state = ?", cd.toArray());
		return ResultUtils.renderSuccessResult(medicalCard);
	}
	
	/**
	 * ELH_BASE_*** 删除常用就诊人就诊卡信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		MedicalCard medicalCard = this.medicalCardManager.get(id);
		medicalCard.setUnbindedAt(DateUtils.getCurrentDateTimeStr());
		if(!medicalCard.getState().equals("0")){
			medicalCard.setState("0");
		}
		MedicalCard saveUser = this.medicalCardManager.save(medicalCard);
		return ResultUtils.renderSuccessResult(saveUser);
	}

	/**
	 * ELH_BASE_*** 查询常用就诊人就诊卡列表
	 * 
	 * @param start 
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/my/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		try{
		StringBuilder sb = new StringBuilder("from MedicalCard t where 1=1 ");
		StringBuilder sc = new StringBuilder("from BankCards where 1=1 ");
		List<String> cparams = new ArrayList<String>();
		List<String> values = new ArrayList<String>();
		if (!data.equals("")) {
			MedicalCard medicalCard = JSONUtils.deserialize(data,
					MedicalCard.class);
			String patientstr = "from Patient where id = ? ";
			Patient patient = this.patientManager.findOne(patientstr, medicalCard.getPatientId());
			if (medicalCard.getId() != null) {
				sb.append(" and t.personId = ?");
				values.add(medicalCard.getPersonId());
			}
			if (medicalCard.getPatientId() != null) {
				sb.append(" and t.patientId = ?");
				sc.append(" and personId = ?");
				values.add(medicalCard.getPatientId());
				cparams.add(patient.getPersonId());
			} else {
				sb.append(" and t.patientId = ?");
				values.add(null);
				sc.append(" and personId = ?");
				cparams.add(null);
			}
			if (medicalCard.getTypeId() != null) {
				sb.append(" and t.typeId = ?");
				values.add(medicalCard.getTypeId());
			}
			if (medicalCard.getOrgId() != null) {
				sb.append(" and t.orgId = ?");
				values.add(medicalCard.getOrgId());
			}
			if (medicalCard.getState() != null) {
				sb.append(" and t.state = ?");
				sc.append(" and state = ?");
				values.add(medicalCard.getState());
				cparams.add(medicalCard.getState());
			}
		}
		Page bankpage = new Page();
		bankpage.setStart(start);
		bankpage.setPageSize(pageSize);
		bankpage.setValues(cparams.toArray());
		bankpage.setQuery(sc.toString());
		this.bankCardsManager.findPage(bankpage);

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(values.toArray());
		page.setQuery(sb.toString());
		this.medicalCardManager.findPage(page);

		MedicalCard mc = null;
		BankCards bs = null;
		@SuppressWarnings("unchecked")
		List<MedicalCard> list = (List<MedicalCard>) page.getResult();
		@SuppressWarnings("unchecked")
		List<BankCards> realnamelist = (List<BankCards>) bankpage.getResult();
		List<MedicalCard> mcs = new ArrayList<MedicalCard>();
		if (realnamelist != null && realnamelist.size() > 0) {
			for (int i = 0; list != null && i < list.size(); i++) {
				mc = list.get(i);
				if (mc != null) {
					String cno = mc.getCardNo();
					for (int j = 0; realnamelist != null
							&& j < realnamelist.size(); j++) {
						bs = (BankCards) realnamelist.get(j);
						if (cno.equals(bs.getCardNo())) {// 这里需要判断是否和bank
															// card的值相等
							mc.setRealName(true);
							break;
						} else {
							mc.setRealName(false);
						}
					}
					mcs.add(mc);
				}
			}
		} else {
			for (int i = 0; list != null && i < list.size(); i++) {
				mc = list.get(i);
				mc.setRealName(false);
				mcs.add(mc);
			}
		}
		page.setResult(mcs);
		return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("");
		}
	}
	
	/**
	 * ELH_BASE_*** 查询卡状态和发卡机构信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/all/cardTypes", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCardType() {
		List<CardType> cardtype = this.cardTypeManager.findAll();
		return ResultUtils.renderSuccessResult(cardtype);
	}
	
	/**
	 * RealName 实名认证
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/doRealName", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forcheckRealName(@RequestBody String data) {
		// TODO 这里需要添加银行验证(接口)
		@SuppressWarnings("rawtypes")
		Map map = JSONUtils.deserialize(data, Map.class);
		/**
		 * 实名认证 先判断有没有就诊人 如果有 就取添加卡到银行卡 如果没有就诊人 需要去person判断有没有人 添加person 添加就诊人
		 * 添加卡
		 */
		String sb = "from Patient where id= ? and status='1'";
		Patient plist = this.patientManager.findOne(sb, map.get("patientId"));
		if (plist!=null && plist.getPersonId() != null) {// 有关联的就诊人,查是否有银行卡
			String hascard = "from BankCards where personId = ? and cardNo = ? and state='1'";
			@SuppressWarnings("unchecked")
			List<BankCards> cardlist = (List<BankCards>) this.bankCardsManager.findByJql(hascard,
					plist.getPersonId(), map.get("cardNo"));
			if (cardlist!=null && cardlist.size()>0 && cardlist.get(0).getState().equals("2")) {
				cardlist.get(0).setState("1");
				this.bankCardsManager.save(cardlist.get(0));
			}else{
				if (cardlist != null && cardlist.size() > 0) {
					return ResultUtils.renderFailureResult(map.get("cardNo")
							+ "已经实名认证");
				} else {
					String bankinfo = "from CardBin where substring(cardBin,1,6)= ? ";
					@SuppressWarnings("unchecked")
					List<CardBin> bankinfolist = (List<CardBin>) this.cardBinManager
					.findByJql(bankinfo, map.get("cardNo").toString()
							.substring(0, 6));
					if (bankinfolist == null || bankinfolist != null
							&& bankinfolist.size() <= 0) {
						return ResultUtils.renderFailureResult("卡号不正确， 请确认后重试");
					}
					BankCards bcs = new BankCards();
					if (map.get("typeId") != null) {
						bcs.setTypeId(map.get("typeId").toString());
					}
					if (map.get("cardNo") != null) {
						bcs.setCardNo(map.get("cardNo").toString());
					}
					if (map.get("cardholder") != null) {
						bcs.setCardHolder(map.get("cardholder").toString());
					}
					bcs.setPersonId(plist.getPersonId());
					bcs.setBankNo(bankinfolist.get(0).getBankNo());
					bcs.setBankName(bankinfolist.get(0).getBankName());
					bcs.setBankCardType(bankinfolist.get(0).getBankCardType());
					bcs.setBankCardTypeName(bankinfolist.get(0)
							.getBankCardTypeName());
					bcs.setOrgId(bankinfolist.get(0).getOrgId());
					bcs.setOrgName(bankinfolist.get(0).getOrgName());
					if (map.get("idCardNo") != null) {
						bcs.setIdCardNo(map.get("idCardNo").toString());
					}
					if (map.get("bindedAt") != null) {
						bcs.setBindedAt(map.get("bindedAt").toString());
					}
					bcs.setState("1");
					if (map.get("mobile") != null) {
						bcs.setMobile(map.get("mobile").toString());
					}
					bcs = this.bankCardsManager.save(bcs);
				}
			}
		} else {
			// 没有person 添加person
			String sup = "from UserPatient where id= ? and status='1'";
			UserPatient userPatient = this.userPatientManager.findOne(sup,
					map.get("id"));
			Person person = new Person();
			person.setGender(userPatient.getGender());
			person.setName(userPatient.getName());
			person.setIdType("01");
			person.setMobile(userPatient.getMobile());
			person.setStatus("1");
			person.setIdNo(userPatient.getIdno());
			person.setType("1");
			person.setExpired("1");
			person.setActive("1");
			person.setUsername(userPatient.getName());
			person.setMail(userPatient.getEmail());
			person.setBornDate(userPatient.getBirthday());

			person = this.personManager.save(person);
			plist.setPersonId(person.getId());
			this.patientManager.save(plist);
			
			String bankinfo = "from CardBin where substring(cardBin,1,6)= ? ";
			@SuppressWarnings("unchecked")
			List<CardBin> bankinfolist = (List<CardBin>) this.cardBinManager
			.findByJql(bankinfo, map.get("cardNo").toString()
					.substring(0, 6));
			if (bankinfolist == null || bankinfolist != null
					&& bankinfolist.size() <= 0) {
				return ResultUtils.renderFailureResult("卡号不正确， 请确认后重试");
			}
			BankCards bcs = new BankCards();
			if (map.get("typeId") != null) {
				bcs.setTypeId(map.get("typeId").toString());
			}
			if (map.get("cardNo") != null) {
				bcs.setCardNo(map.get("cardNo").toString());
			}
			if (map.get("cardholder") != null) {
				bcs.setCardHolder(map.get("cardholder").toString());
			}
			bcs.setPersonId(person.getId());
			bcs.setBankNo(bankinfolist.get(0).getBankNo());
			bcs.setBankName(bankinfolist.get(0).getBankName());
			bcs.setBankCardType(bankinfolist.get(0).getBankCardType());
			bcs.setBankCardTypeName(bankinfolist.get(0)
					.getBankCardTypeName());
			bcs.setOrgId(bankinfolist.get(0).getOrgId());
			bcs.setOrgName(bankinfolist.get(0).getOrgName());
			if (map.get("idCardNo") != null) {
				bcs.setIdCardNo(map.get("idCardNo").toString());
			}
			if (map.get("bindedAt") != null) {
				bcs.setBindedAt(map.get("bindedAt").toString());
			}
			bcs.setState("1");
			if (map.get("mobile") != null) {
				bcs.setMobile(map.get("mobile").toString());
			}
			bcs = this.bankCardsManager.save(bcs);
		}
		return ResultUtils.renderSuccessResult("实名认证成功");
	}
	/**
	 * ELH_BASE_*** 查询常用就诊人就诊卡列表
	 * 
	 * @param start 
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/my/hislist/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forHisList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		StringBuilder sb = new StringBuilder("from MedicalCard t where 1=1 and state=1");
		List<String> values = new ArrayList<String>();
		if (!data.equals("")) {
			MedicalCard medicalCard = JSONUtils.deserialize(data,
					MedicalCard.class);
			if (medicalCard.getPatientId() != null) {
				sb.append(" and t.patientId = ?");
				values.add(medicalCard.getPatientId());
			} else {
				sb.append(" and t.patientId = ?");
				values.add(null);
			}
			if (medicalCard.getOrgId() != null) {
				sb.append(" and t.orgId in (?,?,?)");
				String[] list = medicalCard.getOrgId().split(",");
				for (int i = 0; i <= 2; i++) {
					values.add(list[i]);
				}
			}
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(values.toArray());
		page.setQuery(sb.toString());
		this.medicalCardManager.findPage(page);
		if(page.total==0){
			return ResultUtils.renderFailureResult("没有该医院可挂号的卡，请去绑卡！");
		}else{
			return ResultUtils.renderSuccessResult(page);
		}

	}
	/******************************************************就诊卡app方法end*************************************************************************/
}
