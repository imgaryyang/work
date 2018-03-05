package com.lenovohit.hcp.baseinfo.controller;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;

import com.lenovohit.hcp.base.model.IMedCard;
import com.lenovohit.hcp.base.utils.AgeUtils;

/**
 * 就诊卡信息管理
 */
@RestController
@RequestMapping("/hcp/app/card")
public class ICardRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<Card, String> cardManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	/**
	 * 查询所有卡列表
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		
		IMedCard query =  JSONUtils.deserialize(data, IMedCard.class);
		StringBuilder jql = new StringBuilder("from Card  ");
		List<Object> values = new ArrayList<Object>();
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" hosId = ? ");
			values.add(query.getHosNo());
		}else {
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
	
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//档案编号
		if(!StringUtils.isEmpty(query.getProId())){
			jql.append("and patientId in ( select patientId from Patient where id = ? ) ");
			values.add(query.getProId());
		}
		//档案名称
		if(!StringUtils.isEmpty(query.getProName())){
			jql.append("and name like ? ");
			values.add("%" + query.getProName() + "%");
		}
		//卡号
		if(!StringUtils.isEmpty(query.getCardNo())){
			jql.append("and cardNo like = ? ");
			values.add("%" + query.getCardNo() + "%");
		}
		//卡类型
		
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and cardType = ? ");
			values.add(query.getCardType());
		}
		List<Card> cards=(List<Card>) this.cardManager.findByJql(jql.toString(), values.toArray());
		List<IMedCard> imedCards=TransFormModels(cards);
		return ResultUtils.renderSuccessResult(imedCards);
		}
	
	
	
	/**
	 * @param cards
	 * @return
	 */
	private List<IMedCard> TransFormModels(List<Card> cards) {
		List<IMedCard> imedCards=new ArrayList<IMedCard>();
		for(int i=0;i<cards.size();i++){
			Card card=cards.get(i);
			imedCards.add(TransFormModel(card));
		}
		return imedCards;
	}
	private IMedCard TransFormModel(Card card) {
			IMedCard imedCard=new IMedCard();
			imedCard.setHosNo(card.getHosId());
			Hospital hos=hospitalManager.get(card.getHosId());
			imedCard.setHosName(hos!=null ? hos.getHosName():null);
			Patient patient=patientManager.findOneByProp("patientId", card.getPatientId());
			//imedCard.setProId(patient!=null ? patient.getId():null );
			imedCard.setProNo(patient!=null ? patient.getPatientId():null);
			imedCard.setProName(patient!=null ? patient.getName():null);
			imedCard.setCardNo(card.getCardNo());
			imedCard.setCardType(card.getCardType());
			imedCard.setStatus(card.getCardFlag());
		
		return imedCard;
	}
	/**
	 * 挂失卡
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/reportloss", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result reportLoss(@RequestBody String data){
		IMedCard query =  JSONUtils.deserialize(data, IMedCard.class);
		StringBuilder jql = new StringBuilder("from Card where 1=1  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//档案编号
		if(!StringUtils.isEmpty(query.getProNo())){
			jql.append("and patientId = ?  ");
			values.add(query.getProNo());
		}
		//档案名称
		if(!StringUtils.isEmpty(query.getProName())){
			jql.append("and name like ? ");
			values.add("%" + query.getProName() + "%");
		}
		//卡号
		if(!StringUtils.isEmpty(query.getCardNo())){
			jql.append("and cardNo = ? ");
			values.add(query.getCardNo());
		}
		//卡类型
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and cardType = ? ");
			values.add(query.getCardType());
		}
		}
		Card card=this.cardManager.findOne(jql.toString(), values.toArray());
		card.setCardFlag("2");
		Card saved=this.cardManager.save(card);
		IMedCard imedCard=TransFormModel(saved);
		return ResultUtils.renderSuccessResult(imedCard);
	}
	
	
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		Card model =  JSONUtils.deserialize(data, Card.class);
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		//TODO 校验
		Card saved = this.cardManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 解除挂失
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/unlock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@RequestBody  String data){
		IMedCard query =  JSONUtils.deserialize(data, IMedCard.class);
		StringBuilder jql = new StringBuilder("from Card where 1=1  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//档案编号
		if(!StringUtils.isEmpty(query.getProNo())){
			jql.append("and patientId = ?  ");
			values.add(query.getProNo());
		}
		//档案名称
		if(!StringUtils.isEmpty(query.getProName())){
			jql.append("and name like ? ");
			values.add("%" + query.getProName() + "%");
		}
		//卡号
		if(!StringUtils.isEmpty(query.getCardNo())){
			jql.append("and cardNo like ? ");
			values.add("%" + query.getCardNo() + "%");
		}
		//卡类型
		
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and cardType = ? ");
			values.add(query.getCardType());
		}
		}
		Card card=this.cardManager.findOne(jql.toString(), values.toArray());
		card.setCardFlag("1");
		Card saved=this.cardManager.save(card);
		IMedCard imedCard=TransFormModel(saved);
		return ResultUtils.renderSuccessResult(imedCard);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	/*@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Card> models = cardManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}*/
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.cardManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除多项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM Card WHERE id IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.cardManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
