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
import com.lenovohit.hwe.treat.model.Pacs;
import com.lenovohit.hwe.treat.service.HisPacsService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

//化验明细
@RestController
@RequestMapping("/hwe/treat/his/pacs")
public class PacsHisController extends OrgBaseRestController {

	@Autowired
	private HisPacsService hisPacsService;
	
	// Pacs列表查询
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			Pacs model =  JSONUtils.deserialize(data, Pacs.class);
			RestListResponse<Pacs> response = this.hisPacsService.findList(model, null);
//			return ResultUtils.renderFailureResult("hahahah");
			if(response.isSuccess()){
				return ResultUtils.renderSuccessResult(response.getList());
			}else{
				return ResultUtils.renderFailureResult(response.getMsg());
			}	
		} catch (Exception e) {
			log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	// Pacs明细查询
		@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
		public Result forDetail(@RequestParam(value = "data", defaultValue = "") String data) {
			try {
				Pacs model =  JSONUtils.deserialize(data, Pacs.class);
				RestEntityResponse<Pacs> response = this.hisPacsService.getInfo(model, null);
//				return ResultUtils.renderFailureResult("aaaa");
				if(response.isSuccess())
					return ResultUtils.renderSuccessResult(response.getEntity());
				else 
					return ResultUtils.renderFailureResult(response.getMsg());
			} catch (Exception e) {
				log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
				return ResultUtils.renderFailureResult(e.getMessage());
			}
		}
}
