package com.lenovohit.hcp.card.web.rest;


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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.RedisSequence;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.odws.model.Diagnose;

/**
 * 患者基本信息管理
 */
@RestController
@RequestMapping("/hcp/patient")
public class PatientRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Patient, String> patientManager;
	
	@Autowired
	private GenericManager<Card, String> cardManager;
	
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(
		@PathVariable("start") String start, 
		@PathVariable("limit") String limit,
		@RequestParam(value = "data", defaultValue = "") String data
	){
		
		HcpUser user = this.getCurrentUser();
		Patient query =  JSONUtils.deserialize(data, Patient.class);
		
		StringBuilder jql = new StringBuilder("from Patient where hosId=? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());

		if(!StringUtils.isEmpty(query.getPatientId())){
			jql.append("and patientId like ? ");
			values.add("%" + query.getPatientId() + "%");
		}
		
		if(!StringUtils.isEmpty(query.getIdNo())){
			jql.append("and idNo like ? ");
			values.add("%" + query.getIdNo() + "%");
		}
		
		if(!StringUtils.isEmpty(query.getMedicalCardNo())){
			jql.append("and medicalCardNo like ? ");
			values.add("%" + query.getMedicalCardNo() + "%");
		}
		
		if(!StringUtils.isEmpty(query.getMiCardNo())){
			jql.append("and miCardNo like ? ");
			values.add("%" + query.getMiCardNo() + "%");
		}
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append("and name like ? ");
			values.add("%" + query.getName() + "%");
		}
		
		if(!StringUtils.isEmpty(query.getSex())){
			jql.append("and sex = ? ");
			values.add(query.getSex());
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patientManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 根据id取患者信息
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Patient model= patientManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 根据patientId取患者信息
	 * @param patientId
	 * @return
	 */
	@RequestMapping(value = "/patientId/{patientId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPatientByPatientId(@PathVariable("patientId") String patientId) {
		HcpUser user = this.getCurrentUser();
		String jql = "from Patient where hosId = ? and (patientId = ? or medicalCardNo = ?) ";
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		values.add(patientId);
		values.add(patientId);
		List<Patient> patients = (List<Patient>)patientManager.find(jql, values.toArray());
		if (patients.size() == 0) return ResultUtils.renderFailureResult("查询的患者不存在！");
		return ResultUtils.renderSuccessResult(patients.get(0));
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Patient> models = patientManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreatePatient(@RequestBody String data){
		Patient model =  JSONUtils.deserialize(data, Patient.class);
		
		/*StringBuffer no = new StringBuffer("MZ");
		for(int i = 0 ; i < 10 ; i += 1) {
			no.append((int)(10*(Math.random())));
		}*/
		/*String patientId = redisSequenceManager.get("B_PATIENTINFO", "PATIENT_ID");
		System.out.println("PatientRestController() - patientId:" + patientId);*/

		//保存患者对象
		Patient saved = this.patientManager.save(model);
		
		//保存就诊卡信息
		if (!StringUtils.isEmpty(saved.getMedicalCardNo())) {
			Card card = new Card();
			card.setPatientId(saved.getPatientId());
			card.setName(saved.getName());
			card.setCardNo(saved.getMedicalCardNo());
			card.setCardFlag("1");
			card.setCardType("1");
			this.cardManager.save(card);
		}
	
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Patient model =  JSONUtils.deserialize(data,Patient.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Patient saved = this.patientManager.save(model);

		//保存就诊卡信息
		if (!StringUtils.isEmpty(saved.getMedicalCardNo())) {
			//查询有没有正在使用的卡
			List<Card> cards = cardManager.find("from Card where patientId = ? and cardFlag = ?", saved.getPatientId(), "1");
			if (cards.size() > 0) {
				Card card = cards.get(0);
				if (!card.getCardNo().equals(saved.getMedicalCardNo())) { // 换卡
					// 原卡挂起
					card.setCardFlag("2");
					this.cardManager.save(card);
					// 新建卡
					this.createNewCard(saved);
				} else { // 修改卡信息
					card.setName(saved.getName());
					this.cardManager.save(card);
				}
			} else { // 新建卡
				this.createNewCard(saved);
			}
		}
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	private Card createNewCard(Patient patient) {
		Card card = new Card();
		card.setPatientId(patient.getPatientId());
		card.setName(patient.getName());
		card.setCardNo(patient.getMedicalCardNo());
		card.setCardFlag("1");
		card.setCardType("1");
		card = this.cardManager.save(card);
		return card;
	}
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletePatient(@PathVariable("id") String id){
		try {
			this.patientManager.delete(id);
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
			idSql.append("DELETE FROM Patient WHERE id IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			this.patientManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 记录患者过敏史
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/allergic/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@PathVariable("id") String id, @RequestBody String data) {
		JSONObject json = JSONObject.parseObject(data);
		Patient patient = patientManager.get(id);
		if ("1".equals(json.getString("deny"))) //患者否认过敏史，清空过敏史信息
			patient.setAllergic(null);
		else //患者不否认过敏史，在原过敏史信息基础上加上新过敏信息
			patient.setAllergic(json.getString("itemName") + "\n" + patient.getAllergic());
		Patient saved = patientManager.save(patient);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
