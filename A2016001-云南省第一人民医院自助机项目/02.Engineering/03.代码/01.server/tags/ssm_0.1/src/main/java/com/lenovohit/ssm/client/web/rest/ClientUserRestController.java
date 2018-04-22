package com.lenovohit.ssm.client.web.rest;

import java.util.ArrayList;
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
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.client.model.ClientMenu;
import com.lenovohit.ssm.client.model.Machine;

/**
 * 自助机机器登录管理
 * 以自助机mac地址为唯一标识
 * session记录ssm登录
 */
@RestController
@RequestMapping("/ssm/client/user")
public class ClientUserRestController extends BaseRestController {

	@Autowired
	private GenericManager<Machine, String> machineManager;

	
	@RequestMapping(value="/login",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		//ClientMenu menu =  JSONUtils.deserialize(data, ClientMenu.class);
		//TODO 校验
		//ClientMenu saved = this.machineManager.save(menu);
		return ResultUtils.renderSuccessResult();
	}
}
