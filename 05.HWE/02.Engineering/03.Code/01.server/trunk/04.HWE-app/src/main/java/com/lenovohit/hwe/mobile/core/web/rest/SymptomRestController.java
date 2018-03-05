package com.lenovohit.hwe.mobile.core.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.instrument.classloading.ResourceOverridingShadowingClassLoader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.mobile.core.model.Disease;
import com.lenovohit.hwe.mobile.core.model.Symptom;
import com.lenovohit.hwe.treat.model.Profile;
/**
 * 工具---病症查询
 * @author redstar
 *
 */
@RestController
@RequestMapping("hwe/app/triage")
public class SymptomRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Symptom, String> symptomManager;
	@Autowired
	private GenericManager<Disease, String> diseaseManager;
	
//	@Autowired
//	private GenericManager<Classification, String> classificationManager;
	
	//查找某一个身体部位对应的大病症   
	@RequestMapping(value = "/listBigSymptomsByPartId", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listBigSymptomsByPartId(@RequestParam(value = "data", defaultValue = "") String data) {
		Symptom model = JSONUtils.deserialize(data, Symptom.class);
		String gender = model.getGender() == "0" ? "F" : "M";
		List<Symptom> symptoms = new ArrayList<Symptom>();
		String sql = "SELECT symptom_id, symptom_name, ( SELECT count( * ) FROM APP_SYMPTOM WHERE parent_symptom_id = a.symptom_id ) " +
					"from APP_SYMPTOM a " + 
					"where part_id = " + model.getPartId() + " and (gender='A' or gender='" + gender + "') and min_age <= " + model.getMinAge() + " and max_age >= " + model.getMaxAge();
		List<?> list = this.symptomManager.findBySql(sql);
		for (Object obj : list) {
			Object[] objects = (Object[]) obj;
			Symptom symptom = new Symptom();
			symptom.setSymptomId(Object2String(objects[0]));
			symptom.setSymptomName(Object2String(objects[1]));
			symptom.setChildSymptomCount(Integer.parseInt(Object2String(objects[2])));
			
			symptoms.add(symptom);
		}
		
		return ResultUtils.renderSuccessResult(symptoms);
	}
	
	//查找某一个身体部位对应的大病症   
	@RequestMapping(value = "/listSmallSymptomsByBigSymptomId", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listSmallSymptomsByBigSymptomId(@RequestParam(value = "data", defaultValue = "") String data) {
		Symptom model = JSONUtils.deserialize(data, Symptom.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from Symptom where parentSymptomId  = ? ";
		values.add(model.getParentSymptomId());
		List<Symptom> symptoms=(List<Symptom>) symptomManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(symptoms);
	}
	
	//查找病症对应的疾病
	@RequestMapping(value = "/listDiseasesBySymptomIds", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listDiseasesBySymptomIds(@RequestParam(value = "data", defaultValue = "") String data) {
		Symptom model = JSONUtils.deserialize(data, Symptom.class);
		String symptomIds = model.getSymptomId();
		Map<String, Disease> diseases = new HashMap<String,Disease>();
		Map<String, Double> diseasePresents = new HashMap<String, Double>();
		
		String sql = "SELECT c.DISEASE_ID, c.DISEASE_NAME, a.CORRELATION_DEGREE,c.dept_name, " +
				"c.summary, c.pathogeny, c.symptom, c.disease_check, c.identify, c.prevention, " +
				"c.complication, c.treatment " + 
				"FROM APP_SADR a,APP_SYMPTOM b,APP_DISEASE c " +  
				"WHERE a.symptoms_id = b.symptom_id AND a.disease_id = c.disease_id " + 
				"AND b.symptom_id in (" + symptomIds + ")" ;
		List<?> list = this.symptomManager.findBySql(sql);
		for (Object obj : list) {
			Object[] objects = (Object[]) obj;
			Disease curDisease = new Disease();
			String curDiseaseId = Object2String(objects[0]);
			String curDiseaseName = Object2String(objects[1]);
			Double curDiseasePresent = Object2Double(objects[2]);
			
			curDisease.setDiseaseId(curDiseaseId);
			curDisease.setDiseaseName(curDiseaseName);
			curDisease.setDeptName(Object2String(objects[3]));
			curDisease.setSummary(Object2String(objects[4]));
			curDisease.setPathogeny(Object2String(objects[5]));
			curDisease.setSymptom(Object2String(objects[6]));
			curDisease.setDiseaseCheck(Object2String(objects[7]));
			curDisease.setIdentify(Object2String(objects[8]));
			curDisease.setPrevention(Object2String(objects[9]));
			curDisease.setComplication(Object2String(objects[10]));
			curDisease.setTreatment(Object2String(objects[11]));
			
			diseases.put(curDiseaseId, curDisease);
			
			if (diseasePresents.containsKey(curDiseaseId)) {
				diseasePresents.put(curDiseaseId, 1 - (1 - diseasePresents.get(curDiseaseId)) * (1 - curDiseasePresent));
			} else {
				diseasePresents.put(curDiseaseId, curDiseasePresent);
			}
		}
		
		ArrayList<Disease> resDisease = new ArrayList<Disease>();
		for (Map.Entry<String, Double> entry : diseasePresents.entrySet()) { 
			int idx = 0;
			double curPresent = entry.getValue();
			for (idx = 0; idx < resDisease.size(); idx++) {
				if (diseasePresents.get(resDisease.get(idx).getDiseaseId()) <= curPresent) {
					break;
				}
			}
			
			// 最多只返回10条疾病数据
			if (idx == 10) {
				continue;
			}
			
			resDisease.add(idx, diseases.get(entry.getKey()));
			if (resDisease.size() > 10) {
				resDisease.remove(10);
			}
		}
		
		return ResultUtils.renderSuccessResult(resDisease);
	}
	
//	//查找大病症对应的小病症
//	@RequestMapping(value = "/listSmallSymptomsByBigSymptomsId", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result listSmallSymptomsByBigSymptomsId(@RequestParam(value = "data", defaultValue = "") String data) {
//		Symptom model = JSONUtils.deserialize(data, Symptom.class);
//		List<Object> values=new ArrayList<Object>();
//		String jql="from Symptom where bodyId like = ? ";
//		values.add("%" + model.getPartId() + "%");
//		List<Symptom> symptoms=(List<Symptom>) SymptomManager.findByJql(jql, values.toArray());
//		return ResultUtils.renderSuccessResult(symptoms);
//	}
//	
	
//	//查找化验单子分类
//	@RequestMapping(value = "/listSecondLevelTest", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result listCommonDisease(@RequestParam(value = "data", defaultValue = "") String data) {
//		Classification model = JSONUtils.deserialize(data, Classification.class);
//		List<Object> values=new ArrayList<Object>();
//		values.add(model.getParentNode());
//		String jql="from Classification where classType = 3 and  parentNode = ?  ";
//		List<Classification> dicts=classificationManager.find(jql,values.toArray());
//		return ResultUtils.renderSuccessResult(dicts);
//	}
//	//根据关键字搜索急救方法
//	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
//		Symptom model = JSONUtils.deserialize(data, Symptom.class);
//		List<Object> values=new ArrayList<Object>();
//		String jql="from Symptom where laboratoryName like ? ";
//		values.add("%" + model.getSymptomName() + "%");
//		List<Symptom> laboratory=(List<Symptom>) laboratoryManager.findByJql(jql, values.toArray());
//		return ResultUtils.renderSuccessResult(laboratory);
//	}
//	//根据化验单类型搜索化验单明细
//	@RequestMapping(value = "/listSymptomByType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result listEmergencyByType(@RequestParam(value = "data", defaultValue = "") String data) {
//		Classification model = JSONUtils.deserialize(data, Classification.class);
//		String jql="from  Symptom where classificationId = ? ";
//		List<Object> values=new ArrayList<Object>();
//		values.add(model.getParentNode().trim());
//		//c=emergencyManager.findByProp("classificationId", model.getClassificationId());
//		List<Symptom> laboratory=(List<Symptom>) laboratoryManager.findByJql(jql, values.toArray());
//		return ResultUtils.renderSuccessResult(laboratory);
//	}
	
	public String Object2String(Object object){
		if(object == null){
			return "";
		}
		return object.toString();
	}
	
	public Double Object2Double(Object object){
		if(object == null){
			return 0.0;
		}
		return Double.parseDouble(object.toString());
	}
}
