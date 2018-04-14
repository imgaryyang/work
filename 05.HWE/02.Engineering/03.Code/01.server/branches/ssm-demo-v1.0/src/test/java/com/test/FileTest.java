package com.test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.lenovohit.core.utils.StringUtils;


public class FileTest {
	private static Connection conn;
	private static PreparedStatement st; 
	public static void main(String[] args) {
		open();
		File file = new File("D:\\2.txt");
		BufferedReader reader = null;
		try {
			System.out.println("以行为单位读取文件内容，一次读一整行：");
			reader = new BufferedReader(new FileReader(file));
			String tempString = null;
			int line = 1;
			String[] tempArr;
			String type;
			// 一次读入一行，直到读入null为文件结束
			int i = 0;
			while ((tempString = reader.readLine()) != null) {
				i++;
				tempArr = tempString.split(",");
				if(StringUtils.equals("贷记卡", tempArr[6])){
					type = "3";
				} else if(StringUtils.equals("借记卡", tempArr[6])){
					type = "1";
				} else if(StringUtils.equals("预付费卡", tempArr[6])){
					type = "7";
				} else if(StringUtils.equals("准贷记卡", tempArr[6])){
					type = "5";
				} else {
					type = "";
				}
////			民生银行,03050001,民生万事达世界卡,16,6,545217,贷记卡
//				install("INSERT INTO  SSM_CARD_BIN values ('"
//						+ +"','"
//						+ +"','"
//						+ +"','"
//						+ +"','"
//						+ +"','"
//						+ type +"','"
//						+ +"','"
//						+ +"')");
//				   ID                   CHAR(32) not null,
//				   CARD_BIN             VARCHAR(10),
//				   CARD_BIN_NUM         int,
//				   CARD_NAME            VARCHAR(100),
//				   CARD_NUM             int,
//				   CARD_TYPE            VARCHAR(10) comment '1 - 借记卡
//				   BANK_CODE            VARCHAR(20),
//				   BANK_NAME            VARCHAR(100),
					st.setString(1, StringUtils.uuid());  
					st.setString(2, tempArr[5]);  
					st.setString(3, tempArr[4]);  
					st.setString(4, tempArr[2]);  
					st.setString(5, tempArr[3]);  
					st.setString(6, type);  
					st.setString(7, tempArr[1]);  
					st.setString(8, tempArr[0]);  
					st.addBatch();
//					st.addBatch("INSERT INTO  SSM_CARD_BIN values ('"
//							+ StringUtils.uuid()+"','"
//							+ tempArr[5]+"','"
//							+ tempArr[4]+"','"
//							+ tempArr[2]+"','"
//							+ tempArr[3]+"','"
//							+ type+"','"
//							+ tempArr[1]+"','"
//							+ tempArr[0]+"'");   
				if (i % 100 == 0) {
					st.executeBatch();     
					conn.commit();   
					st.clearBatch();    
				} 
				// 显示行号
				System.out.println("line " + line + ": " + tempString);
				line++;
			}
			st.executeBatch(); 
			conn.commit(); 
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
			close();
		}
	}
	public static void open(){
		String driver = "com.mysql.jdbc.Driver";
		// localhost指本机，也可以用本地ip地址代替，3306为MySQL数据库的默认端口号，“user”为要连接的数据库名
		String url = "jdbc:mysql://103.234.126.8:3306/SSM_TEST?createDatabaseIfNotExist=true&amp;useUnicode=true&amp;useSSL=false&amp;characterEncoding=utf-8;rewriteBatchedStatements=true";
		// 填入数据库的用户名跟密码
		String username = "lenovohit";
		String password = "lenovohit";
//		String sql = "select * from user";// 编写要执行的sql语句，此处为从user表中查询所有用户的信息
		try {
			Class.forName(driver);// 加载驱动程序，此处运用隐式注册驱动程序的方法
			conn = DriverManager.getConnection(url, username, password);// 创建连接对象
			conn.setAutoCommit(false); 
			st = conn.prepareStatement("INSERT INTO  SSM_CARD_BIN values(?,?,?,?,?,?,?,?)");// 创建sql执行对象
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void close() {
		// 关闭相关的对象
		if (st != null) {
			try {
				st.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

	}
//	public static void install(String sql) {
//
//		try {
//			for (int i = 1; i <= COUNT; i += BATCH_SIZE) {     
//				st.clearBatch();     
//				for (int j = 0; j < BATCH_SIZE; j++) {         
//					st.setInt(1, i + j);         
//					st.setString(2, DATA);         
//					st.addBatch();     
//				}     
//				st.executeBatch();     
//				if ((i + BATCH_SIZE - 1) % COMMIT_SIZE == 0) {
//					conn.commit();     
//				} 
//			} 
//			
//			
//			
//			
//			
//			pstmt = conn.prepareStatement("insert into loadtest (id, data) values (?, ?)");
//			for (int i = 1; i <= COUNT; i += BATCH_SIZE) {     pstmt.clearBatch();     for (int j = 0; j < BATCH_SIZE; j++) {         pstmt.setInt(1, i + j);         pstmt.setString(2, DATA);         pstmt.addBatch();     }     pstmt.executeBatch();     if ((i + BATCH_SIZE - 1) % COMMIT_SIZE == 0) {         conn.commit();     } } conn.commit(); 
//			System.out.println("sql" + sql);
//			st.execute(sql);
////			ResultSet rs = st.executeQuery(sql);// 执行sql语句并返回结果集
////			while (rs.next()){
////				System.out.println("username: " + rs.getString(1));// 通过列的标号来获得数据
////				System.out.println("useradd: " + rs.getString("useradd"));// 通过列名来获得数据
////				System.out.println("userage: " + rs.getInt("userage"));
////			}
//			
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
//	}

}
