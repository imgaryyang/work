package com.lenovohit.hcp.card.web.rest;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

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
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.manager.PatientCardManager;
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.card.model.Patient;

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
	
	@Autowired
	private PatientCardManager patientCardManager;
	
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
	 * 根据条件查询总转入转出统计
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/patientTransfer", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadPatientTransfer(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String startMonth = query.getString("startMonth");
			String endMonth = query.getString("endMonth");
			List<Object> values = new ArrayList<Object>();
			values.add(startMonth);
			values.add(endMonth);
			values.add(this.getCurrentUser().getHosId());
			//获得月份开头不以0开始
			String start=startMonth.substring(5).startsWith("0") ? startMonth.substring(6):startMonth.substring(5);
			String end=endMonth.substring(5).startsWith("0") ? endMonth.substring(6):endMonth.substring(5);
			//获得月份以int类型
			int start1=Integer.parseInt(start);	
			int end1=Integer.parseInt(end);	
			List months=new ArrayList<>();
			//将开始到结束的每个月分都记录下来。
			for(int j=start1;j<=end1;j++){
				months.add(j);
			}
			//String a="SELECT DATEPART(month, t.time+'-01'),tin from (select LEFT(CONVERT(varchar(50), create_time, 20), 7) AS 'time',count(*) as 'tin' from b_patientinfo WHERE create_time<='2017-07-01' GROUP BY LEFT(CONVERT(varchar(50), create_time, 20), 7))as t";
			// 转入查询
			String jqlIn="select LEFT(CONVERT(varchar(50), create_time, 20), 7) as date1,count(*) as rec from b_patientinfo WHERE LEFT(CONVERT(varchar(50), create_time, 20), 7)>= ? and LEFT(CONVERT(varchar(50), create_time, 20), 7)<= ? and hos_id = ? GROUP BY LEFT(CONVERT(varchar(50), create_time, 20), 7) ";
			List listIn=patientManager.findBySql(jqlIn,values.toArray());
			// 转出查询
			String jqlOut="select LEFT(CONVERT(varchar(50), leave_time, 20), 7) as date1,count(*) as rec from b_patientinfo WHERE LEFT(CONVERT(varchar(50), leave_time, 20), 7)>= ? and LEFT(CONVERT(varchar(50), leave_time, 20), 7)<= ? and hos_id = ? GROUP BY LEFT(CONVERT(varchar(50), leave_time, 20), 7) ";
			List listOut=patientManager.findBySql(jqlOut,values.toArray());
			
			Map<Integer,Object> in=new TreeMap<Integer, Object>();  
			Map<Integer,Object> out=new TreeMap<Integer, Object>();
			
			//将数据库返回的[2017-01,14]的list以map的形式存储---转入
			for(int i=0;i<listIn.size();i++){
				Object [] obj=(Object[]) listIn.get(i);
				String str=(String) obj[0];
				String month=str.substring(5).startsWith("0") ? str.substring(6) :str.substring(5) ;
				in.put(Integer.parseInt(month),obj[1]);
			}
			//将数据库返回的[2017-01,14]的list以map的形式存储---转出
			for(int i=0;i<listOut.size();i++){
				Object [] obj=(Object[]) listOut.get(i);
				String str=(String) obj[0];
				String month=str.substring(5).startsWith("0") ? str.substring(6) :str.substring(5) ;
				out.put(Integer.parseInt(month),obj[1]);
			}
			//遍历每个月分，如果不存在当月的记录则置0.
			for (Object object : months) {
				Integer key=(Integer) object;
				if(in.get(key)==null){
					in.put(key, 0);
				}
				if(out.get(key)==null){
					out.put(key, 0);
				}
			}
			
			
			List<Object[]> rtn=new ArrayList<Object[]>() ;
			//将月份，转入，转出转化成三个数组。
			for(Entry<Integer, Object> vo : in.entrySet()){ 
				Object[] objs=new Object[4];
				objs[0]=vo.getKey()+"月"; 
				objs[1]=vo.getValue(); 
				objs[2]=out.get(vo.getKey());
				rtn.add(objs);
	        }
			return ResultUtils.renderSuccessResult(rtn);
		}catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("患者转入转出统计出错！");
		}
	}
	
	
	
	/**
	 * 根据条件查询出每个月的转入转出数据
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/patientTransferChartData", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadPatientTransferChartData(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String startMonth = query.getString("startMonth");
			String endMonth = query.getString("endMonth");
			List<Object> values = new ArrayList<Object>();
			values.add(startMonth);
			values.add(endMonth);
			values.add(this.getCurrentUser().getHosId());
			//获得月份开头不以0开始
			String start=startMonth.substring(5).startsWith("0") ? startMonth.substring(6):startMonth.substring(5);
			String end=endMonth.substring(5).startsWith("0") ? endMonth.substring(6):endMonth.substring(5);
			//获得月份以int类型
			int start1=Integer.parseInt(start);	
			int end1=Integer.parseInt(end);	
			System.out.println(start1);
			System.out.println(end1);
			List months=new ArrayList<>();
			//将开始到结束的每个月分都记录下来。
			for(int j=start1;j<=end1;j++){
				months.add(j);
			}
			//String a="SELECT DATEPART(month, t.time+'-01'),tin from (select LEFT(CONVERT(varchar(50), create_time, 20), 7) AS 'time',count(*) as 'tin' from b_patientinfo WHERE create_time<='2017-07-01' GROUP BY LEFT(CONVERT(varchar(50), create_time, 20), 7))as t";
			// 转入查询
			String jqlIn="select LEFT(CONVERT(varchar(50), create_time, 20), 7) as date1,count(*) as rec from b_patientinfo WHERE LEFT(CONVERT(varchar(50), create_time, 20), 7)>= ? and LEFT(CONVERT(varchar(50), create_time, 20), 7)<= ?  and hos_id = ? GROUP BY LEFT(CONVERT(varchar(50), create_time, 20), 7) ";
			List listIn=patientManager.findBySql(jqlIn,values.toArray());
			// 转出查询
			String jqlOut="select LEFT(CONVERT(varchar(50), leave_time, 20), 7) as date1,count(*) as rec from b_patientinfo WHERE LEFT(CONVERT(varchar(50), leave_time, 20), 7)>= ? and LEFT(CONVERT(varchar(50), leave_time, 20), 7)<= ?  and hos_id = ?  GROUP BY LEFT(CONVERT(varchar(50), leave_time, 20), 7) ";
			List listOut=patientManager.findBySql(jqlOut,values.toArray());
			
			Map<Integer,Object> in=new TreeMap<Integer, Object>();
			Map<Integer,Object> out=new TreeMap<Integer, Object>();
			
			//将数据库返回的[2017-01,14]的list以map的形式存储---转入
			for(int i=0;i<listIn.size();i++){
				Object [] obj=(Object[]) listIn.get(i);
				String str=(String) obj[0];
				String month=str.substring(5).startsWith("0") ? str.substring(6) :str.substring(5) ;
				in.put(Integer.parseInt(month),obj[1]);
			}
			//将数据库返回的[2017-01,14]的list以map的形式存储---转出
			for(int i=0;i<listOut.size();i++){
				Object [] obj=(Object[]) listOut.get(i);
				String str=(String) obj[0];
				String month=str.substring(5).startsWith("0") ? str.substring(6) :str.substring(5) ;
				out.put(Integer.parseInt(month),obj[1]);
			}
			//遍历每个月分，如果不存在当月的记录则置0.
			for (Object object : months) {
				Integer key=(Integer) object;
				if(in.get(key)==null){
					in.put(key, 0);
				}
				if(out.get(key)==null){
					out.put(key, 0);
				}
			}
			int size=months.size();
			Object[] mon=new Object[size];
			Object[] transIn=new Object[size];
			Object[] transOut=new Object[size];
			int q=0;
			//将月份，转入，转出转化成三个数组。
			for(Entry<Integer, Object> vo : in.entrySet()){ 
	            mon[q]=vo.getKey()+"月"; 
	            transIn[q]=vo.getValue(); 
	            transOut[q]=out.get(vo.getKey());
	            q++;
	        }
			
			List<Object[]> rtn=new ArrayList<Object[]>();
			rtn.add(mon);
			rtn.add(transIn);
			rtn.add(transOut);
			return ResultUtils.renderSuccessResult(rtn);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("患者转入转出统计出错！");
		}
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
	 * 根据身份證號取患者信息
	 * @param patientId
	 * @return
	 */
	@RequestMapping(value = "/idNo/{idNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPatientByIdCard(@PathVariable("idNo") String idNo) {
		HcpUser user = this.getCurrentUser();
		String jql = "from Patient where hosId = ? and (idNo = ?) ";
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());
		values.add(idNo);
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
		try{
			Patient model =  JSONUtils.deserialize(data, Patient.class);
			//获取当前登入用户信息
			HcpUser user = this.getCurrentUser();
			String jql = "from Patient where hosId = ? and (idNo = ?) ";
			List<Object> values = new ArrayList<Object>();
			values.add(user.getHosId());
			values.add(model.getIdNo());
			//根据医院id和身份证id，来查看在该医院，身份证是否被占用
			List<Patient> patient = patientManager.find(jql, values.toArray());
			if(patient.size()>0){
				return ResultUtils.renderFailureResult("身份证账号已被占用，建档失败！");
			}
			//根据医院id和诊疗卡id，来查看在该医院，诊疗卡是否被占用
			if(model.getMedicalCardNo() != null && model.getMedicalCardNo() != ""){
				String sql = "from Patient where hosId = ? and (medicalCardNo = ?) ";
				List<Object> objects = new ArrayList<Object>();
				objects.add(user.getHosId());
				objects.add(model.getMedicalCardNo());
				List<Patient> patients = patientManager.find(sql, objects.toArray());
				if(patients.size()>0){
					return ResultUtils.renderFailureResult("诊疗卡已被占用，建档失败！");
				}
			}
			Patient saved = patientCardManager.createCard(model);
			return ResultUtils.renderSuccessResult(saved);
		}catch(Exception e){
			e.printStackTrace();
			System.err.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		try{
			Patient model =  JSONUtils.deserialize(data,Patient.class);
			if(model==null || StringUtils.isBlank(model.getId())){
				return ResultUtils.renderFailureResult("不存在此对象");
			}
			if(model.getId()!=null){
				Patient patient = this.patientManager.get(model.getId());
				//获取当前登入用户信息
				HcpUser user = this.getCurrentUser();
				List<Object> values = new ArrayList<Object>();
				if(!patient.getIdNo().equals(model.getIdNo())){
					String jql = "from Patient where hosId = ? and (idNo = ?) ";
					values.add(user.getHosId());
					values.add(model.getIdNo());
					//根据医院id和身份证id，来查看在该医院，身份证是否被占用
					List<Patient> patientList = patientManager.find(jql, values.toArray());
					if(patientList.size()>0){
						return ResultUtils.renderFailureResult("身份证账号已被占用，更新失败！");
					}
				}
				if((model.getMedicalCardNo() != null || model.getMedicalCardNo() != "") && !model.getMedicalCardNo().equals(patient.getMedicalCardNo())){
					//根据医院id和诊疗卡id，来查看在该医院，诊疗卡是否被占用
					String sql = "from Patient where hosId = ? and (medicalCardNo = ?) ";
					values = new ArrayList<Object>();
					values.add(user.getHosId());
					values.add(model.getMedicalCardNo());
					List<Patient> patients = patientManager.find(sql, values.toArray());
					if(patients.size()>0){
						return ResultUtils.renderFailureResult("诊疗卡已被占用，更新失败！");
					}
				}
			}
			Patient saved = patientCardManager.updateCard(model);
			return ResultUtils.renderSuccessResult(saved);
		}catch(Exception e){
			return ResultUtils.renderFailureResult(e.getMessage());
		}
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
