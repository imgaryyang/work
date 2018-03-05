package com.lenovohit.els.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.tools.security.SecurityUtil;
import com.lenovohit.bdrp.tools.security.impl.SecurityConstants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.User;
import com.lenovohit.els.model.PerMng;
import com.lenovohit.els.model.StubBatchinfo;

@RestController
@RequestMapping("/els/stubbatchinfo")
public class StubBatchinfoRestController extends BaseRestController {

	@Autowired
	private GenericManager<StubBatchinfo, String> stubBatchinfoManager;
	@Autowired
	private GenericManager<PerMng, String> perMngManager;

	/**
	 * ELS_STUB_011	新增工资批次明细信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("新增工资批次明细，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		StubBatchinfo in = JSONUtils.deserialize(data, StubBatchinfo.class);
		if (null == in) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(in.getBatchId())) {
			throw new BaseException("批次ID不可为空！");
		}
		
		if (StringUtils.isEmpty(in.getPerId())) {
			throw new BaseException("人员ID不可为空！");
		}
		
		String vldJql = "from StubBatchinfo where batchId = ? and perId = ?";

		List<StubBatchinfo> lst = this.stubBatchinfoManager.find(vldJql, in.getBatchId(), in.getPerId());

		if (lst.size() > 0) {
			throw new BaseException("该批次该人员已存在！");
		}

		this.stubBatchinfoManager.save(in);

		return ResultUtils.renderSuccessResult(in);
	}

	/**
	 * ELS_STUB_011	修改工资批次明细信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("修改工资批次明细，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		StubBatchinfo in = JSONUtils.deserialize(data, StubBatchinfo.class);
		if (null == in) {
			throw new BaseException("输入数据为空！");
		}

		if (StringUtils.isEmpty(in.getId())) {
			throw new BaseException("批次明细ID不可为空！");
		}

		StubBatchinfo tin = this.stubBatchinfoManager.get(in.getId());
		if (null == tin) {
			throw new BaseException("更新明细不存在！");
		}
		
		this.stubBatchinfoManager.save(in);

		return ResultUtils.renderSuccessResult(in);
	}
	
	/**
	 * ELS_STUB_013	删除工资批次明细信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		log.info("删除批次明细，输入数据为：" + id);

		if (StringUtils.isEmpty(id)) {
			throw new BaseException("批次ID不可为空！");
		}

		StubBatchinfo tin = this.stubBatchinfoManager.delete(id);
		if (null == tin) {
			throw new BaseException("删除批次不存在！");
		}

		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_STUB_013	批量删除工资批次明细信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/deletes/{ids}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletes(@PathVariable("ids") String ids) {
		log.info("删除批次明细，输入数据为：" + ids);
		if (StringUtils.isEmpty(ids)) {
			throw new BaseException("输入数据为空！");
		}

		String vldJql = "from StubBatchinfo where id in ( ? )";		
		this.stubBatchinfoManager.executeSql(vldJql,ids);

		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_STUB_010	工资批次明细列表查询
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "batchId", defaultValue = "") String batchId,
			@RequestParam(value = "name") String name,@RequestParam(value = "note") String note) {
		log.info("分页查询批次明细列表，输入数据为：【" + batchId + "】");
		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("输入数据为空！");
		}
		List<String> al = new ArrayList<String>();
		al.add(batchId);
		
		String hsql = "from StubBatchinfo where batchId = ? ";
		if( !(StringUtils.isEmpty(name)) ) {
			hsql += "and name like ? ";
			al.add("%"+name+"%");
		}
		if( !(StringUtils.isEmpty(note)) ) {
			hsql += "and note like ?";
			al.add("%"+note+"%");
		}		
		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);
		p.setQuery(hsql);
		p.setValues(al.toArray());
		this.stubBatchinfoManager.findPage(p);
		
		return ResultUtils.renderSuccessResult(p);
	}
	
	/**
	 * ELS_STUB_019	按年月查询用户工资列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/perstublist/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPerStubList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "month", defaultValue = "") String month) {		

		User optUser= (User)this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		String idNo = optUser.getIdCardNo();
		String idNoEnc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ID, Constants.APP_SUPER_ID, idNo, SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];

		StringBuffer vldJql = new StringBuffer("select distinct(a) from StubBatchinfo a,PerMng b where a.perId=b.id ");
		List<String> al = new ArrayList<String>();
		
		if (!StringUtils.isEmpty(month)) {
			vldJql.append(" and a.month = ?");
			al.add(month);
		}
		if (!StringUtils.isEmpty(idNoEnc)) {
			vldJql.append(" and b.idNoEnc = ?");
			al.add(idNoEnc);
		}
		vldJql.append(" order by a.month desc");
	
		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);
		p.setQuery(vldJql.toString());
		p.setValues(al.toArray());
		this.stubBatchinfoManager.findPage(p);
		
		return ResultUtils.renderSuccessResult(p);
	}
	
	/**
	 * ELS_STUB_012	查询工资条详情
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/detail/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfos(@PathVariable(value = "id") String id) {
		log.info("查询工资条详情，输入数据为：【" + id + "】");
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入数据为空！");
		}
		
		StubBatchinfo out = this.stubBatchinfoManager.get(id);

		return ResultUtils.renderSuccessResult(out);
	}

}
