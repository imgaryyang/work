package com.lenovohit.ssm.base.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;

import com.jcraft.jsch.SftpException;
import com.lenovohit.core.utils.DateUtils;


/**
 * FTP远程命令列表 USER PORT RETR ALLO DELE SITE XMKD CDUP FEAT PASS PASV STOR REST
 * CWD STAT RMD XCUP OPTS ACCT TYPE APPE RNFR XCWD HELP XRMD STOU AUTH REIN STRU
 * SMNT RNTO LIST NOOP PWD SIZE PBSZ QUIT MODE SYST ABOR NLST MKD XPWD MDTM PROT
 * 在服务器上执行命令,如果用sendServer来执行远程命令(不能执行本地FTP命令)的话，所有FTP命令都要加上\r\n
 * ftpclient.sendServer("XMKD /test/bb\r\n"); //执行服务器上的FTP命令
 * ftpclient.readServerResponse一定要在sendServer后调用 nameList("/test")获取指目录下的文件列表
 * XMKD建立目录，当目录存在的情况下再次创建目录时报错 XRMD删除目录 DELE删除文件
 */

public class FtpUtils {
	
	protected transient final Log log = LogFactory.getLog(getClass());
	
	private FtpUtils() {

	}

	static FtpUtils instance;

	public static FtpUtils getInstance() {
		if (null == instance)
			instance = new FtpUtils();
		return instance;
	}

	private String ip;

	private String username;

	private String password;

	private int port;

	FTPClient ftpClient = null;

	OutputStream os = null;

	FileInputStream is = null;

	public FtpUtils(String serverIP, String username, String password) {
		this.ip = serverIP;
		this.username = username;
		this.password = password;
	}

	public FtpUtils(String serverIP, int port, String username, String password) {
		this.ip = serverIP;
		this.username = username;
		this.password = password;
		this.port = port;
	}

	/**
	 * 连接ftp服务器
	 * 
	 * @throws IOException
	 */
	public boolean connectServer() {
		boolean success = true;
		ftpClient = new FTPClient();
		int reply;
		try {
			ftpClient.connect(ip, port);
			ftpClient.setControlEncoding("GBK");
			ftpClient.setConnectTimeout(30000);  
//			FTPClientConfig conf = new FTPClientConfig(FTPClientConfig.SYST_NT);
//			conf.setServerLanguageCode("zh");

			// 如果采用默认端口，可以使用ftp.connect(url) 的方式直接连接FTP服务器
			ftpClient.login(username, password);// 登录
			reply = ftpClient.getReplyCode();
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftpClient.disconnect();
				success = false;
			}
			log.info("FTP连接成功。IP:"+ip +"PORT:" +port);  
		} catch (SocketException e) {
			e.printStackTrace();
			success = false;
		} catch (IOException e) {
			e.printStackTrace();
			success = false;
		}
		// 下面三行代码必须要，而且不能改变编码格式
		
		return success;
	}

	/**
	 * 断开与ftp服务器连接
	 * 
	 * @throws IOException
	 */
	public boolean closeServer() {
		try {
			if (is != null) {
				is.close();
			}
			if (os != null) {
				os.close();
			}
			if (ftpClient != null && ftpClient.isConnected()) {
				ftpClient.logout();
				ftpClient.disconnect();
			}
			log.info("FTP已从服务器断开");
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 检查文件夹在当前目录下是否存在
	 * 
	 * @param dir
	 * @return
	 */
	private boolean isDirExist(String dir) {
		return true;
	}

	/**
	 * 在当前目录下创建文件夹
	 * 
	 * @param dir
	 * @return
	 * @throws Exception
	 */
	private boolean createDir(String dir) {
		return false;
	}

	/**
	 * ftp上传 如果服务器段已存在名为filename的文件夹，该文件夹中与要上传的文件夹中同名的文件将被替换
	 * 
	 * @param filename
	 *            要上传的文件（或文件夹）名
	 * @return
	 * @throws Exception
	 */
	public boolean upload(String filename) {
		String newname = "";
		if (filename.indexOf("/") > -1) {
			newname = filename.substring(filename.lastIndexOf("/") + 1);
		} else {
			newname = filename;
		}
		return upload(filename, newname);
	}

	/**
	 * ftp上传 如果服务器段已存在名为newName的文件夹，该文件夹中与要上传的文件夹中同名的文件将被替换
	 * 
	 * @param fileName
	 *            要上传的文件（或文件夹）名
	 * @param newName
	 *            服务器段要生成的文件（或文件夹）名
	 * @return
	 */
	public boolean upload(String fileName, String newName) {
			return true;
	}

	/**
	 * 真正用于上传的方法
	 * 
	 * @param fileName
	 * @param newName
	 * @param path
	 * @throws Exception
	 */
	private void upload(String fileName, String newName, String path)
			throws Exception {
		
	}

	/**
	 * upload 上传文件
	 * 
	 * @param filename
	 *            要上传的文件名
	 * @param newname
	 *            上传后的新文件名
	 * @return -1 文件不存在 >=0 成功上传，返回文件的大小
	 * @throws Exception
	 */
	public long uploadFile(String filename, String newname) throws Exception {
		long result = 0;
		return result;
	}

	/**
	 * 从ftp下载文件到本地
	 * 
	 * @param filename
	 *            服务器上的文件名
	 * @param newfilename
	 *            本地生成的文件名
	 * @return
	 * @throws Exception
	 */
	public long downloadFile(String directory, String fileName, String newfilename) {
		long result = 0;
		try {
			ftpClient.changeWorkingDirectory(directory);
			ftpClient.setFileTransferMode(FTPClient.BINARY_FILE_TYPE);
			ftpClient.enterLocalPassiveMode();  
			FTPFile[] fs = ftpClient.listFiles(); // 得到目录的相应文件列表
			for (FTPFile ftpFile : fs) {
				if (ftpFile.getName().equals(fileName)) {
					os = new FileOutputStream(new File(newfilename));  
					ftpClient.retrieveFile(ftpFile.getName(), os);
					os.flush();
					os.close();
					result++;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 取得相对于当前连接目录的某个目录下所有文件列表
	 * 
	 * @param path
	 * @return
	 */
	public List<String> getFileList(String path) {
		List<String> list = new ArrayList<String>();
		FTPFile[] remoteFiles = null;
		try {
			remoteFiles = ftpClient.listFiles(path);
			log.info("目录" + path + "下的文件:");
			if (remoteFiles != null) {
				for (FTPFile ftpFile : remoteFiles) {
					list.add(ftpFile.getName());
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return list;
	}
	public static void main(String[] args) throws SftpException, IOException {
		FtpUtils ftp = new FtpUtils("42.243.108.227", 222, "khyy_dl", "Khyy_downlord");
		List<Date> l = DateUtils.findDays(new Date(117,5,1), new Date(117,6,8));
		String checkDateStr = "";
		for(Date d : l){
			checkDateStr = DateUtils.date2String(d, "yyyyMMdd");
			ftp.connectServer();
			ftp.downloadFile("/", checkDateStr+".txt", "C:\\SSM\\App\\ssm\\checkfile\\0306\\"+checkDateStr+".txt");
			ftp.closeServer();
			System.out.println(checkDateStr);
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
