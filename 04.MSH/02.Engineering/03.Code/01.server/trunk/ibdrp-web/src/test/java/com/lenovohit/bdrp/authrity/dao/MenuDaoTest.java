package com.lenovohit.bdrp.authrity.dao;

import java.text.MessageFormat;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.bdrp.ApplicationTest;
import com.lenovohit.bdrp.authority.model.Menu;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.core.utils.StringUtils;

public class MenuDaoTest extends ApplicationTest {

	@Autowired
	private GenericDao<Menu, String> menuDao;
	String menuSqlTpl = "INSERT INTO IH_MENU(ID,CODE,NAME,PARENT,ICON,TYPE_,SORTER,AID) VALUES({0},{1},{2},{3},{4},{5},{6},{7})";
	String functionSqlTpl = "INSERT INTO IH_FUNCTION(ID,NAME,URI,PARENT) VALUES({0},{1},{2},{3})";
	String resourceSqlTpl = "INSERT INTO IH_FUNCTION(ID,NAME,URI,PARENT) VALUES({0},{1},{2},{3})";
	String accessSqlTpl = "INSERT INTO IH_ACCESS(ID,NAME,FUNCTION) VALUES({0},{1},{2})";
	StringBuilder menuSqlSb = new StringBuilder();
	StringBuilder funcSqlSb = new StringBuilder();
	StringBuilder resSqlSb = new StringBuilder();
	StringBuilder accSqlSb = new StringBuilder();

	@Test
	public void testFindByJql() {
		String jql = "from Menu ";
		List<Menu> parentLst = this.menuDao.find(jql + " where parent is null");
		for (Menu m : parentLst) {
			funcSqlSb.append(MessageFormat.format(functionSqlTpl, "'" + m.getId() + "'", "'" + m.getName() + "'", StringUtils.isBlank(m.getUrl())?"null":"'" + m.getUrl() + "'", "null")).append(";\n");
			accSqlSb.append(MessageFormat.format(accessSqlTpl, "'" + m.getId() + "'", "'" + m.getName() + "'", "'" + m.getId() + "'")).append(";\n");
			menuSqlSb.append(MessageFormat.format(menuSqlTpl, "'" + m.getId() + "'", "'" + m.getCode() + "'", "'" + m.getName() + "'", "null","'"+m.getIconPath()+"'","'"+m.getAccType()+"'",m.getSort(),"'"+m.getId()+"'")).append(";\n");
			
			findList(m.getId());
			funcSqlSb.append("\n");
			accSqlSb.append("\n");
			menuSqlSb.append("\n");
		}
		System.out.println(funcSqlSb.toString());
		System.out.println(accSqlSb.toString());
		System.out.println(menuSqlSb.toString());
	}

	private void findList(String pid) {
		String jql = "from Menu  ";
		List<Menu> lst = this.menuDao.find(jql + " where parent.id = ? ", pid);
		for (Menu m : lst) {
			funcSqlSb.append(MessageFormat.format(functionSqlTpl, "'" + m.getId() + "'", "'" + m.getName() + "'", StringUtils.isBlank(m.getUrl())?"null":"'" + m.getUrl() + "'", "'"+pid+"'")).append(";\n");
			accSqlSb.append(MessageFormat.format(accessSqlTpl, "'" + m.getId() + "'", "'" + m.getName() + "'", "'" + m.getId() + "'")).append(";\n");
			menuSqlSb.append(MessageFormat.format(menuSqlTpl, "'" + m.getId() + "'", "'" + m.getCode() + "'", "'" + m.getName() + "'", "'" + m.getParentId() + "'","'"+m.getIconPath()+"'","'"+m.getAccType()+"'",m.getSort(),"'"+m.getId()+"'")).append(";\n");
		}
		for (Menu m : lst) {
			findList(m.getId());
		}
	}
}
