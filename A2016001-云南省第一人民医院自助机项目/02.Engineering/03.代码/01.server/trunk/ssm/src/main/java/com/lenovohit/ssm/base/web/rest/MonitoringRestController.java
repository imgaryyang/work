package com.lenovohit.ssm.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.manager.IRedisMonitoringManager;
import com.lenovohit.ssm.base.model.Machine;
 


@RestController
@Component
@RequestMapping("/ssm/base/redis")
public class MonitoringRestController extends SSMBaseRestController {
	@Autowired
	private IRedisMonitoringManager redisMonitoringManager;
	@Autowired
	private GenericManagerImpl<Machine,String> machineManager;
	

	@RequestMapping(value = "/save", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void save(){
		try {
			Map<String, String> map = null;
			String ip = this.getIpAddr();
			String mac = this.getMacAddr();
			Date now =  new Date();
			String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
			List<Machine> machines = machineManager.findAll();
			String json = (String) redisMonitoringManager.get("machines");
			if(json != null && !"".equals(json)){
				ObjectMapper mapper = new ObjectMapper();
				map = mapper.readValue(json, new TypeReference<HashMap<String,String>>(){});
			}else{
				map = new HashMap<String, String>();
			}
			if(mac != null && !"".equals(mac)){
				for(Machine machine : machines){
					if(!mac.equals(machine.getMac())){
						Machine newMachine = new Machine();
						newMachine.setMac(mac);
					}
				}
				map.put(mac, time);
				String string = JSONUtils.serialize(map);
				redisMonitoringManager.set("machines", string);
			}else{
				System.out.println("mac无法获取");
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/list/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		JSONObject jsonObject = JSONUtils.parseObject(data);
		String json = (String) redisMonitoringManager.get("machines");
		List<Machine> list = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> map = null;
		try {
			map = mapper.readValue(json, new TypeReference<HashMap<String,String>>(){});
		} catch (Exception e) {
			e.printStackTrace();
		}
		for (Map.Entry<String, String> entry : map.entrySet()) {
			   Machine machine = null;
			   if(jsonObject.containsKey("code")){	
				   String code = (String)  jsonObject.get("code");
				   machine = machineManager.findOne(" from Machine where mac = ? and mngCode = ? ", entry.getKey(),code);
				   if(machine != null){
					   machine.setMonitorState(entry.getValue());
					   list.add(machine);
				   }	   
			   }else{
				   machine = machineManager.findOne(" from Machine where mac = ? ", entry.getKey());
				   if(machine != null ){
					   machine.setMonitorState(entry.getValue());
					   list.add(machine);
				   }else{
					   Machine newMachine = new Machine();
					   newMachine.setName("未注册的自助机");
					   newMachine.setMonitorState(entry.getValue());
					   list.add(newMachine);
				   } 
			   }
		}
		int newStart = Integer.parseInt(start);
		int newLimit = Integer.parseInt(limit);
		int size = list.size();
		list = list.subList(newStart, size>(newStart+newLimit)?newLimit:(size-newStart));
		return ResultUtils.renderSuccessResult(list);
	}
	
	@RequestMapping(value = "/myList/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		JSONObject jsonObject = JSONUtils.parseObject(data);
		String json = (String) redisMonitoringManager.get("machines");
		List<Machine> list = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> map = null;
		List<Machine> machines = machineManager.findAll();
		try {
			map = mapper.readValue(json, new TypeReference<HashMap<String,String>>(){});
		} catch (Exception e) {
			e.printStackTrace();
		}
		for (Map.Entry<String, String> entry : map.entrySet()) {
			   if(jsonObject.containsKey("code")){	
				   String code = (String)  jsonObject.get("code");
				   for(Machine machine2 : machines){
					   if(entry.getKey().equals(machine2.getMac()) && code.equals(machine2.getMngCode())){
						   machine2.setMonitorState(entry.getValue());
						   list.add(machine2);
					   }
				   }
			   }else{
				   for(Machine machine3 : machines){
					   if(entry.getKey().equals(machine3.getMac())){
						   machine3.setMonitorState(entry.getValue());
						   list.add(machine3);
					   }else{
						   Machine newMachine = new Machine();
						   String uuid = UUID.randomUUID().toString().replaceAll("-", "");
						   newMachine.setId(uuid);
						   newMachine.setName("未注册的自助机");
						   newMachine.setMonitorState(entry.getValue());
						   list.add(newMachine);
					   }
				   }
			   }
		}
		int newStart = Integer.parseInt(start);
		int newLimit = Integer.parseInt(limit);
		int size = list.size();
		list = list.subList(newStart, size>(newStart+newLimit)?newLimit:(size-newStart));
		return ResultUtils.renderSuccessResult(list);
	}
}
