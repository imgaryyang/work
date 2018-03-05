package com.lenovohit.hcp.test.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.lenovohit.hcp.test.db.model.Column;
import com.lenovohit.hcp.test.db.model.Table;

public class ModelCreatTest {

	public static void main(String args[]) throws Exception{
		String tableName = "MATERIAL_CERTIFICATE";
		String modelName = "MatCertificate";
		
		String jql = "select COLUMN_NAME,DATA_TYPE from information_schema.columns "
				+ "where table_schema = 'HCP' "
				+ "and table_name = '"+tableName+"'";
		Connection con = getConnect();
		
		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery(jql);
		Table table = new Table(tableName, modelName);
		while(rs.next()){   
	        String COLUMN_NAME = rs.getString(1) ;
	        String DATA_TYPE = rs.getString(2) ;
	        String COLUMN_COMMENT = rs.getString(3) ;
	        Column column = new Column(COLUMN_NAME,DATA_TYPE,COLUMN_COMMENT);
			table.addColumn(column);
	     }   
		System.out.println(table.toModel());
	}

	private static Connection getConnect() throws Exception {
		try {
			// 加载MySql的驱动类
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		} catch (ClassNotFoundException e) {
			System.out.println("找不到驱动程序类 ，加载驱动失败！");
			throw e;
		}
		String url="jdbc:sqlserver://103.234.126.8:1433;instanceName=MSSQLSERVER;DatabaseName=HCP";
		String username = "hcp";
		String password = "Lenovohit_2017";
		Connection con = null;
		try {
			con = DriverManager.getConnection(url, username, password);
			return con;
		} catch (SQLException se) {
			System.out.println("数据库连接失败！");
			se.printStackTrace();
			throw se;
		}
	}
}
