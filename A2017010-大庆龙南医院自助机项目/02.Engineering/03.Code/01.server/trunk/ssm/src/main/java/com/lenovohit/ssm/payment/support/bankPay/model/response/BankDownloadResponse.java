package com.lenovohit.ssm.payment.support.bankPay.model.response;

/**
 * API基础响应信息。
 * 
 * @author zyus
 */
public class BankDownloadResponse extends BankResponse {

	private String  checkDate;          // 对账日期	字符(8)YYYYMMDD
    private String  refundTotal;        // 退款总笔数	数字(10)
    private String  refundTotalAmt;     // 退款总金额	数字(16,2)
    private String  fileName;           // 明细文件名	字符(20)
    private int  fileLength;         // 明细文件长度	数字(8)
    
	public String getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(String checkDate) {
		this.checkDate = checkDate;
	}

	public String getRefundTotal() {
		return refundTotal;
	}

	public void setRefundTotal(String refundTotal) {
		this.refundTotal = refundTotal;
	}

	public String getRefundTotalAmt() {
		return refundTotalAmt;
	}

	public void setRefundTotalAmt(String refundTotalAmt) {
		this.refundTotalAmt = refundTotalAmt;
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
