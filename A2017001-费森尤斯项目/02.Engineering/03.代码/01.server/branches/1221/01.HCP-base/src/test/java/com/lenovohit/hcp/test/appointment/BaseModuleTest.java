package com.lenovohit.hcp.test.appointment;

import static org.junit.Assert.*;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.test.BaseTest;

public class BaseModuleTest extends BaseTest {

	@Resource
	private GenericManager<Dictionary, String> dictionaryManager;
	@Resource
	private GenericManager<Department, String> departmentManager;

	@Test
	public void testFindPops() {
		String hosId = "H31AAAA001";
		StringBuilder sql = new StringBuilder("from Department where 1=1 and hosId = ? and isRegdept = '1'");
		List<Department> departments = departmentManager.find(sql.toString(), hosId);
		assertEquals(8, departments.size());
	}

}
