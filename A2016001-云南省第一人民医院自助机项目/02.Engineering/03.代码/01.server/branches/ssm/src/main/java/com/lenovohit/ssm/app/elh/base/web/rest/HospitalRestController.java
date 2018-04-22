package com.lenovohit.ssm.app.elh.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.elh.base.model.Hospital;

/**
 * 医院管理 TODO 支持的卡类型
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/hospital")
public class HospitalRestController extends BaseRestController {
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	@RequestMapping(value = "/demo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result demo(){
		List<Hospital> list = hospitalManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
}




