package com.infohold.els.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.els.model.StubBatchinfo;
import com.infohold.els.model.StubPreview;

@RestController
@RequestMapping("/els/stubpreview")
public class StubPreviewRestController extends BaseRestController {

	@Autowired
	private GenericManager<StubPreview, String> stubPreviewManager;
	@Autowired
	private GenericManager<StubBatchinfo, String> stubBatchinfoManager;

	/**
	 * ELS_STUB_006 工资明细文件导入预览
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "batchId") String batchId) {
		log.info("工资明细文件导入预览，输入批次ID为：【" + batchId + "】");

		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("批次ID不可为空！");
		}

		String vldJql = "from StubPreview where batchId = ? ";

		List<StubPreview> lstout = this.stubPreviewManager
				.find(vldJql, batchId);

		return ResultUtils.renderSuccessResult(lstout);
	}

	/**
	 * ELS_STUB_007 工资明细文件导入确认
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/confirm", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forConfirm(@RequestParam(value = "batchId") String batchId) {
		log.info("工资明细文件导入预览，输入批次ID为：【" + batchId + "】");

		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("批次ID不可为空！");
		}

		String vldJql = "from StubPreview where batchId = ? ";
		List<StubPreview> lstout = this.stubPreviewManager.find(vldJql, batchId);

		for (StubPreview sp : lstout) {
			StubBatchinfo sbi = new StubBatchinfo(sp);
			StubBatchinfo result = this.stubBatchinfoManager.save(sbi);
			if( result!=null ){
				vldJql = "delete from ELS_STUB_PREVIEW where batch_Id = ? ";
				this.stubPreviewManager.executeSql(vldJql, batchId);
			}
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除工资发放明细预览文件
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{batchId}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result deletePreview(@PathVariable("batchId") String batchId) {
		
		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("请输入预览批次ID！");
		}
		
		String sql = "DELETE FROM ELS_STUB_PREVIEW WHERE BATCH_ID = ? ";
		int count = stubPreviewManager.executeSql(sql, batchId);
		
		log.info("取消导入，删除预览工资明细预览记录：" + count + "条！");
		
		return ResultUtils.renderSuccessResult();
	}
}
