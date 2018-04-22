package com.lenovohit.ssm.payment.support.bankPay.model.response;

/**
 * API基础响应信息。
 * 
 * @author zyus
 */
public class BankDownloadResponse extends BankResponse {

	private String  checkDate;          // 对账日期	字符(8)YYYYMMDD
    private String  total;        		// 总笔数		数字(10)
    private String  totalAmt;     		// 总金额		数字(16,2)
    private String  fileName;           // 明细文件名	字符(20)
    private int  fileLength;         	// 明细文件长度	数字(8)
    
	public String getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(String checkDate) {
		this.checkDate = checkDate;
	}

	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	public String getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(String totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public int getFileLength() {
		return fileLength;
	}
	public void setFileLength(int fileLength) {
		this.fileLength = fileLength;
	}

}
