package com.lenovohit.hwe.treat.web.rest;

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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Images;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.manager.MessageManager;
import com.lenovohit.hwe.treat.model.ConsultRecord;
import com.lenovohit.hwe.treat.model.ConsultReply;
import com.lenovohit.hwe.treat.model.Doctor;

@RestController
@RequestMapping("/hwe/treat/consultRecord")
public class ConsultRecordRestController extends OrgBaseRestController{
	
	@Autowired
	private GenericManager<ConsultRecord, String> consultRecordManager;
	
	@Autowired
	private GenericManager<ConsultReply, String> consultReplyManager;
	
	@Autowired
	private GenericManager<Images, String> imagesManager;
	
	@Autowired
	private MessageManager messageManager;
	
	@RequestMapping(value = "/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data){
		ConsultRecord model = JSONUtils.deserialize(data, ConsultRecord.class);
		Doctor doctor = new Doctor();
		doctor.setId(model.getDoctorId());
		model.setDoctor(doctor);
		model.setCreatedAt(new Date());
		if(StringUtils.isBlank(model.getId())){
			model.setStatus(ConsultRecord.STATUS_NO_REPLY);
		}
		ConsultRecord record = this.consultRecordManager.save(model);
		return ResultUtils.renderSuccessResult(record);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		ConsultRecord record = this.consultRecordManager.delete(id);
		return ResultUtils.renderSuccessResult(record);
	}
	
	@RequestMapping(value = "/complete",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data){
		ConsultRecord model = JSONUtils.deserialize(data, ConsultRecord.class);
		model = this.consultRecordManager.get(model.getId());
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setStatus(ConsultRecord.STATUS_COMPLETE);
		model.setUpdatedAt(new Date());
		ConsultRecord record = this.consultRecordManager.save(model);
		return ResultUtils.renderSuccessResult(record);
	}
	

	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(){
		List<ConsultRecord> list = consultRecordManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start , @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		ConsultRecord record = JSONUtils.deserialize(data, ConsultRecord.class);
		
		StringBuilder jql = new StringBuilder( " from ConsultRecord where 1=1 ");
		List<String> cdList = new ArrayList<String>();
		if (record!=null && StringUtils.isNoneBlank(record.getHosId())) {
			jql.append(" and hosId = ?");
			cdList.add(record.getHosId());
		}
		if (record!=null && StringUtils.isNoneBlank(record.getCreatedBy())) {
			jql.append(" and createdBy = ?");
			cdList.add(record.getCreatedBy());
		}
		if (record!=null && StringUtils.isNoneBlank(record.getStatus())) {
			jql.append(" and status = ? ");
			cdList.add(record.getStatus());
		}else{
			jql.append(" and status in ( ? , ? )");
			cdList.add("1");
			cdList.add("2");
		}
		
		jql.append(" ORDER BY  createdAt DESC");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(cdList.toArray());
		this.consultRecordManager.findPage(page);
		if(page.getResult()!=null){
			for(ConsultRecord r : (List<ConsultRecord>)page.getResult()){
				// 医患咨询回复
				List<ConsultReply> replay = consultReplyManager.find(" from ConsultReply where businessId = ? ",r.getId());
                r.setReplyList(replay);
                
                //咨询图片
                List<Images> images = imagesManager.find(" from Images where fkId = ? and fkType='consult_image' ",r.getId());
                r.setImages(images);
			}
		}
		return ResultUtils.renderSuccessResult(page);
	}
	
	@RequestMapping(value = "/reply",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result reply(@RequestBody String data){
		if(messageManager.sendReply(data)){
			return ResultUtils.renderSuccessResult("回复成功");
		}else{
			return ResultUtils.renderFailureResult();
		}
		
	}
	
	
}
