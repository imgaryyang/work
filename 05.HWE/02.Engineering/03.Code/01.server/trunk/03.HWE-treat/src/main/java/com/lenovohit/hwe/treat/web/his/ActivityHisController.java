package com.lenovohit.hwe.treat.web.his;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Activity;
import com.lenovohit.hwe.treat.model.Diagnose;
import com.lenovohit.hwe.treat.model.RecordDrug;
import com.lenovohit.hwe.treat.model.RecordTest;
import com.lenovohit.hwe.treat.service.HisActivityService;
import com.lenovohit.hwe.treat.service.HisDiagnoseService;
import com.lenovohit.hwe.treat.service.HisRecordDrugService;
import com.lenovohit.hwe.treat.service.HisRecordService;
import com.lenovohit.hwe.treat.service.HisRecordTestService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/his/activity/")
public class ActivityHisController extends OrgBaseRestController {
	
	@Autowired
	private HisActivityService hisActivityService;

	@Autowired
	private HisDiagnoseService diagnoseService;

	@Autowired
	private HisRecordService hisRecordService;

	@Autowired
	private HisRecordDrugService hisRecordDrugService;

	@Autowired
	private HisRecordTestService hisRecordTestService;

	//诊疗活动记录
	@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result list(@RequestParam(value = "data", defaultValue = "") String data) {
		Activity model = JSONUtils.deserialize(data, Activity.class);
		RestListResponse<Activity> response = this.hisActivityService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());

	}
	//诊断列表
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
		RecordDrug model = JSONUtils.deserialize(data, RecordDrug.class);
		//查询相关联的处方列表
		RestListResponse<RecordDrug> response = this.hisRecordDrugService.findList(model, null);

		if(response.isSuccess()) {
			/*List<RecordDrug> recordDrugs = new ArrayList<RecordDrug>();
			for(int i = 0; i < response.getList().size(); i++){
				RecordDrug rDrug = new RecordDrug();
				rDrug.setRecordNo(response.getList().get(i).getId());
				//查询该处方下所关联的药物明细列表
				RestListResponse<RecordDrug> _response = this.hisRecordDrugService.findList(rDrug, null);
				recordDrugs.addAll(_response.getList());
			}*/
			return ResultUtils.renderSuccessResult(response.getList());
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
	//化验列表
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
