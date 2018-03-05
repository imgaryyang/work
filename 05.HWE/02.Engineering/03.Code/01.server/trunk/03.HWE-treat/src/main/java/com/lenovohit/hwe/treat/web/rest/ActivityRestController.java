package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Activity;
import com.lenovohit.hwe.treat.model.Diagnose;
import com.lenovohit.hwe.treat.model.Record;
import com.lenovohit.hwe.treat.model.RecordDrug;
import com.lenovohit.hwe.treat.model.RecordTest;
import com.lenovohit.hwe.treat.model.TestDetail;
import com.lenovohit.hwe.treat.service.HisActivityService;
import com.lenovohit.hwe.treat.service.HisDiagnoseService;
import com.lenovohit.hwe.treat.service.HisRecordDrugService;
import com.lenovohit.hwe.treat.service.HisRecordService;
import com.lenovohit.hwe.treat.service.HisRecordTestService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/activity/")
public class ActivityRestController extends OrgBaseRestController {
	
	@Autowired
	private GenericManager<Activity, String> activityManager;
	
//	@Autowired
//	private HisActivityService activityService;

	@Autowired
	private HisDiagnoseService diagnoseService;
	
	@Autowired
	private HisRecordService hisRecordService;
	
	@Autowired
	private HisRecordDrugService hisRecordDrugService;
	
	@Autowired
	private HisRecordTestService hisRecordTestService;
	
	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;
	
	@Autowired
	private GenericManager<RecordDrug, String> recordDrugManager;
	
	@Autowired
	private GenericManager<Record, String> recordManager;
	
	@Autowired
	private GenericManager<RecordTest, String> recordTestManager;
	
	@Autowired
	private GenericManager<TestDetail, String> testDetailManager;
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Activity model = this.activityManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "forlist/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Activity model = JSONUtils.deserialize(data, Activity.class);
		StringBuffer jql = new StringBuffer("from Activity n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getProNo())){
				jql.append(" and n.proNo = ?");
				values.add(model.getProNo());
			}
			if(StringUtils.isNotBlank(model.getHosNo())){
				jql.append(" and n.hosNo = ?");
				values.add(model.getHosNo());
			}
			
		}else{
			return ResultUtils.renderFailureResult("查询条件不能为空！");
		}
		jql.append(" order by createdAt desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.activityManager.findPage(page);
		ArrayList<Activity> lists = (ArrayList) page.getResult();
		
		if(lists != null){
			//查询Diagnose表里所关联的数据
			lists = this.addDiagnose(lists);
			//查询Record表里所关联的数据
			lists = this.addRecord(lists);
			page.setResult(lists);
		}
		return ResultUtils.renderSuccessResult(page);
		
	}
	private ArrayList<Activity> addDiagnose(ArrayList<Activity> lists){
		for(Activity activity : lists){
			StringBuffer jql_d = new StringBuffer("from Diagnose d where 1=1 ");
			List<String> values_d = new ArrayList<String>();
			jql_d.append(" and d.actNo = ?");
			values_d.add(activity.getId());
			jql_d.append(" order by createdAt desc");
			@SuppressWarnings("unchecked")
			List<Diagnose> list = (List<Diagnose>) this.diagnoseManager.findByJql(jql_d.toString(), values_d.toArray());
			activity.setDiagnose(list);
		}
		return lists;
	}
	private ArrayList<Activity> addRecord(ArrayList<Activity> lists){
		for(Activity activity : lists){
			StringBuffer jql_r = new StringBuffer("from Record n where 1=1 ");
			List<String> values_r = new ArrayList<String>();
			jql_r.append(" and n.actNo = ?");
			values_r.add(activity.getId());
			jql_r.append(" order by createdAt desc");
			@SuppressWarnings("unchecked")
			List<Record> list = (List<Record>) this.recordManager.findByJql(jql_r.toString(), values_r);
			if(list!=null){
				for(Record record: list){
					StringBuffer jql_rd = new StringBuffer("from RecordDrug n where 1=1 ");
					List<String> values_rd = new ArrayList<String>();
					jql_rd.append(" and n.recordNo = ?");
					values_rd.add(record.getId());
					jql_rd.append(" order by createdAt desc");
					List<RecordDrug> drugList = (List<RecordDrug>) this.recordDrugManager.findByJql(jql_rd.toString(), values_rd.toArray());
					record.setRecordDrug(drugList);
				}
				for(Record record: list){
					StringBuffer jql_rt = new StringBuffer("from RecordTest n where 1=1 ");
					List<String> values_rt = new ArrayList<String>();
					jql_rt.append(" and n.recordNo = ?");
					values_rt.add(record.getId());
					jql_rt.append(" order by createdAt desc");
					List<RecordTest> drugTestList = (List<RecordTest>) this.recordTestManager.findByJql(jql_rt.toString(), values_rt.toArray());
					if(drugTestList!=null){
						for(RecordTest recordTest: drugTestList){
							StringBuffer jql_td = new StringBuffer("from TestDetail n where 1=1 ");
							List<String> values_td = new ArrayList<String>();
							jql_td.append(" and n.testId = ?");
							values_td.add(recordTest.getId());
							jql_td.append(" order by createdAt desc");
							List<TestDetail> testDetailList = (List<TestDetail>) this.testDetailManager.findByJql(jql_td.toString(), values_td.toArray());
							recordTest.setTestDetail(testDetailList);
						}
					}
					record.setRecordTest(drugTestList);
				}
			}
			activity.setRecord(list);
		}
		return lists;
	}
	
	/*@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result list(@RequestParam(value = "data", defaultValue = "") String data) {
		Activity model = JSONUtils.deserialize(data, Activity.class);
		RestListResponse<Activity> response = this.activityService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
		
	}*/
	@RequestMapping(value = "diagnoseList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result diagnoseList(@RequestParam(value = "data", defaultValue = "") String data) {
		Diagnose model = JSONUtils.deserialize(data, Diagnose.class);
		RestListResponse<Diagnose> response = this.diagnoseService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	@RequestMapping(value = "recordList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result recordList(@RequestParam(value = "data", defaultValue = "") String data) {
		Record model = JSONUtils.deserialize(data, Record.class);
		//查询相关联的处方列表
		RestListResponse<Record> response = this.hisRecordService.findList(model, null);

		if(response.isSuccess()) {
			List<RecordDrug> recordDrugs = new ArrayList<RecordDrug>();
			for(int i = 0; i < response.getList().size(); i++){
				RecordDrug rDrug = new RecordDrug();
				rDrug.setRecordNo(response.getList().get(i).getId());
				//查询该处方下所关联的药物明细列表
				RestListResponse<RecordDrug> _response = this.hisRecordDrugService.findList(rDrug, null);
				recordDrugs.addAll(_response.getList());
			}
			return ResultUtils.renderSuccessResult(recordDrugs);
		} else {
			return ResultUtils.renderFailureResult(response.getMsg());
		}
	}
	@RequestMapping(value = "recordDrugList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result recordDrugList(@RequestParam(value = "data", defaultValue = "") String data) {
		RecordDrug model = JSONUtils.deserialize(data, RecordDrug.class);
		RestListResponse<RecordDrug> response = this.hisRecordDrugService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	@RequestMapping(value = "recordTestList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result recordTestList(@RequestParam(value = "data", defaultValue = "") String data) {
		RecordTest model = JSONUtils.deserialize(data, RecordTest.class);
		RestListResponse<RecordTest> response = this.hisRecordTestService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
