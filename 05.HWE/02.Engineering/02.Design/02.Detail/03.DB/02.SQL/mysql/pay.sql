/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/12/22 15:53:37                          */
/*==============================================================*/


DROP INDEX SSM_ORDER_INDEX ON PAY_BILL;

DROP TABLE IF EXISTS PAY_BILL;

DROP TABLE IF EXISTS PAY_CARD_BIN;

DROP TABLE IF EXISTS PAY_CASH_BATCH;

DROP TABLE IF EXISTS PAY_CASH_ERROR;

DROP TABLE IF EXISTS PAY_CHANNEL;

DROP TABLE IF EXISTS PAY_CHECK_DETAIL_ALIPAY;

DROP TABLE IF EXISTS PAY_CHECK_DETAIL_BANK;

DROP TABLE IF EXISTS PAY_CHECK_DETAIL_RESULT;

DROP TABLE IF EXISTS PAY_CHECK_DETAIL_WXPAY;

DROP TABLE IF EXISTS PAY_CHECK_RECORD;

DROP TABLE IF EXISTS PAY_SETTLEMENT;

DROP TABLE IF EXISTS PAY_TYPE;

/*==============================================================*/
/* Table: PAY_BILL                                              */
/*==============================================================*/
CREATE TABLE PAY_BILL
(
   ID                   CHAR(32) NOT NULL,
   BILL_NO              VARCHAR(50),
   BILL_TYPE            CHAR(2) COMMENT 'OP - 支付
                        OR - 退款
                        OC - 撤销',
   BILL_TITLE           VARCHAR(200),
   BILL_DESC            VARCHAR(500),
   AMT                  NUMERIC(17,2),
   REAL_AMT             NUMERIC(17,2),
   LAST_AMT             NUMERIC(17,2),
   PA_AMT               NUMERIC(17,2),
   MI_AMT               NUMERIC(17,2),
   SELF_AMT             NUMERIC(17,2),
   REDUCE_AMT           NUMERIC(17,2),
   APP_CHANNEL          CHAR(2),
   APP_ID               CHAR(32),
   APP_NAME             VARCHAR(50),
   TERMINAL_ID          CHAR(32),
   TERMINAL_CODE        VARCHAR(50),
   TERMINAL_NAME        VARCHAR(70),
   TERMINAL_USER        VARCHAR(50),
   PROFILE_ID           CHAR(32),
   PROFILE_NO           VARCHAR(50),
   PROFILE_NAME         VARCHAR(50),
   BIZ_TYPE             CHAR(2) COMMENT '''00'': ''门诊预存'',
                        ''01'': ''预约'',
                        ''02'': ''挂号'',
                        ''03'': ''缴费（诊间结算）'',
                        ''04'': ''住院预缴'',
                        ''05'': ''办理就诊卡'',',
   BIZ_NO               VARCHAR(50),
   BIZ_URL              VARCHAR(200),
   BIZ_BEAN             VARCHAR(50),
   BIZ_TIME             VARCHAR(20),
   TRAN_TIME            DATETIME,
   FINISH_TIME          DATETIME,
   OUT_TIME             VARCHAR(20),
   ORI_BILL_ID          CHAR(32),
   OPT_STATUS           CHAR(1),
   OPT_TIME             DATETIME,
   OPT_ID               CHAR(32),
   OPT_NAME             VARCHAR(50),
   OPERATION            VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'INITIAL = "A"	
                        TRAN_SUCCESS = "0"
                        PAY_SUCCESS = "1"
                        PAY_FAILURE = "2"
                        THIRD_FAILURE = "3"
                        TRAN_FINISH = "4"
                        REFUNDING = "5"
                        FAILURE = "6"
                        SUCCESS = "7"
                        EXCEPTIONAL = "8"
                        CLOSED = "9"',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Index: SSM_ORDER_INDEX                                       */
/*==============================================================*/
CREATE INDEX SSM_ORDER_INDEX ON PAY_BILL
(
   TRAN_TIME
);

/*==============================================================*/
/* Table: PAY_CARD_BIN                                          */
/*==============================================================*/
CREATE TABLE PAY_CARD_BIN
(
   ID                   CHAR(32) NOT NULL,
   CARD_BIN             VARCHAR(10),
   CARD_BIN_NUM         INT,
   CARD_NAME            VARCHAR(100),
   CARD_NUM             INT,
   CARD_TYPE            VARCHAR(10) COMMENT '1 - 借记卡
                        2 - 储蓄卡
                        3 - 贷记卡
                        4 - 信用卡
                        5 - 准贷记卡
                        6 - 双币贷记卡
                        7 - 预付卡
                        8 - 虚拟账户 
                        9 - 社保卡
                        10-外卡
                        11-VISA
                        12-MASTER
                        13-AMEX
                        14-DINER
                        15-JCB
                        16-VISA-DCC
                        17-MASTER_DCC
                        18-MAESTRO
                        19-VISA',
   BANK_CODE            VARCHAR(20),
   BANK_NAME            VARCHAR(100),
   CLEAN_BANK_CODE      VARCHAR(12),
   CLEAN_BANK_NAME      VARCHAR(100),
   PRIVINCE             VARCHAR(50),
   CITY                 VARCHAR(50),
   CITY_CODE            VARCHAR(4),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CASH_BATCH                                        */
/*==============================================================*/
CREATE TABLE PAY_CASH_BATCH
(
   ID                   CHAR(32) NOT NULL,
   BATCH_NO             VARCHAR(16),
   PRINT_TIME           DATETIME,
   IMPORT_TIME          DATETIME,
   COUNT                INT DEFAULT 0,
   AMT                  NUMERIC(17,2) DEFAULT 0,
   MACHINE_ID           CHAR(32),
   MACHINE_CODE         VARCHAR(20),
   MACHINE_MAC          VARCHAR(28),
   MACHINE_NAME         VARCHAR(20),
   BATCH_DAY            VARCHAR(20),
   BANK_AMT             NUMERIC(17,2) DEFAULT 0,
   BANK_COUNT           INT DEFAULT 0,
   AMT1                 NUMERIC(17,2),
   AMT2                 NUMERIC(17,2),
   AMT5                 NUMERIC(17,2),
   AMT10                NUMERIC(17,2),
   AMT20                NUMERIC(17,2),
   AMT50                NUMERIC(17,2),
   AMT100               NUMERIC(17,2),
   COUNT1               INT,
   COUNT2               INT,
   COUNT5               INT,
   COUNT10              INT,
   COUNT20              INT,
   COUNT50              INT,
   COUNT100             INT,
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CASH_ERROR                                        */
/*==============================================================*/
CREATE TABLE PAY_CASH_ERROR
(
   ID                   CHAR(32) NOT NULL,
   RET                  VARCHAR(20),
   MSG                  VARCHAR(500),
   APP_CHANNEL          CHAR(2),
   APP_ID               CHAR(32),
   APP_NAME             VARCHAR(50),
   MACHINE_ID           CHAR(32),
   MACHINE_CODE         VARCHAR(20),
   MACHINE_MAC          VARCHAR(50),
   MACHINE_NAME         VARCHAR(50),
   USER_ID              CHAR(32),
   USER_CODE            VARCHAR(50),
   USER_NAME            VARCHAR(50),
   PROFILE_ID           CHAR(32),
   PROFILE_NO           VARCHAR(50),
   PROFILE_NAME         VARCHAR(50),
   ORDER_ID             CHAR(32),
   ORDER_NO             VARCHAR(50),
   SETTLE_ID            CHAR(32),
   SETTLE_NO            VARCHAR(50),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHANNEL                                           */
/*==============================================================*/
CREATE TABLE PAY_CHANNEL
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(50),
   CODE                 VARCHAR(20),
   MCH_ID               VARCHAR(50),
   MCH_NAME             VARCHAR(70),
   APP_ID               VARCHAR(50),
   ACC_NO               VARCHAR(50),
   ACC_NAME             VARCHAR(70),
   PRIVATE_KEY          VARCHAR(500),
   PUBLIC_KEY           VARCHAR(500),
   SIGN_CERT_PATH       VARCHAR(200),
   SIGN_CERT_USER       VARCHAR(50),
   SIGN_CERT_PWD        VARCHAR(50),
   ENCRYPT_CERT_PATH    VARCHAR(200),
   ENCRYPT_CERT_USER    VARCHAR(50),
   ENCRYPT_CERT_PWD     VARCHAR(50),
   VALIDATE_CERT_PATH   VARCHAR(200),
   VALIDATE_CERT_USER   VARCHAR(50),
   VALIDATE_CERT_PWD    VARCHAR(50),
   PAY_URL              VARCHAR(200),
   REFUND_URL           VARCHAR(200),
   CANCEL_URL           VARCHAR(200),
   QUERY_URL            VARCHAR(200),
   CHECK_URL            VARCHAR(200),
   CHECK_TIME           CHAR(8),
   REF_CHECK_URL        VARCHAR(200),
   REF_CHECK_TIME       CHAR(8),
   RET_CHECK_TIME       CHAR(8),
   RET_CHECK_URL        VARCHAR(200),
   FRONT_IP             VARCHAR(50),
   FRONT_PORT           VARCHAR(10),
   CHARSET              VARCHAR(10),
   CONTACTS             VARCHAR(50),
   PHONE                VARCHAR(20),
   EMAIL                VARCHAR(50),
   QQ                   VARCHAR(20),
   IS_POS               CHAR(1),
   IS_SSM               CHAR(1),
   CARD_TYPE            CHAR(1) COMMENT '0 - all
                        1 - 储蓄卡
                        2 - 信用卡',
   MEMO                 VARCHAR(200),
   STATUS               CHAR(1) COMMENT '0 - 测试
                        1 - 激活
                        9 - 停用',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHECK_DETAIL_ALIPAY                               */
/*==============================================================*/
CREATE TABLE PAY_CHECK_DETAIL_ALIPAY
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   OUT_TRADE_NO         VARCHAR(64),
   TRADE_NO             VARCHAR(64),
   TRADE_TYPE           VARCHAR(20),
   SUBJECT              VARCHAR(256),
   CREATE_TIME          VARCHAR(20),
   FINISH_TIME          VARCHAR(20),
   STORE_ID             VARCHAR(32),
   STORE_NAME           VARCHAR(128),
   OPERATOR_ID          VARCHAR(32),
   TERMINAL_ID          VARCHAR(32),
   SELLER_ID            VARCHAR(50),
   AMT                  NUMERIC(17,2),
   CLEAR_AMT            NUMERIC(17,2),
   COUPON_AMT           NUMERIC(17,2),
   POINT_AMT            NUMERIC(17,2),
   DISCOUNT_AMT         NUMERIC(17,2),
   M_DISCOUNT_AMT       NUMERIC(17,2),
   TICKET_AMT           NUMERIC(17,2),
   TICKET_NAME          VARCHAR(128),
   M_COUPON_AMT         NUMERIC(17,2),
   CARD_AMT             NUMERIC(17,2),
   REQUEST_NO           VARCHAR(64),
   SERVICE_AMT          NUMERIC(17,2),
   COMMISSION           NUMERIC(17,2),
   MEMO                 VARCHAR(256),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHECK_DETAIL_BANK                                 */
/*==============================================================*/
CREATE TABLE PAY_CHECK_DETAIL_BANK
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   MERCHANET            VARCHAR(50),
   TERMINAL             VARCHAR(50),
   BATCH_NO             VARCHAR(20),
   ACCOUNT              VARCHAR(32),
   AMT                  NUMERIC(17,2),
   CLEAR_AMT            NUMERIC(17,2),
   CARD_TYPE            VARCHAR(20),
   CARD_BANK_CODE       VARCHAR(20),
   OUT_TRADE_NO         VARCHAR(50),
   TRADE_TYPE           VARCHAR(20),
   TRADE_NO             VARCHAR(50),
   TRADE_DATE           VARCHAR(20),
   TRADE_TIME           VARCHAR(20),
   CLEAR_DATE           VARCHAR(20),
   TRADE_STATUS         CHAR(1),
   MEMO                 VARCHAR(200),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHECK_DETAIL_RESULT                               */
/*==============================================================*/
CREATE TABLE PAY_CHECK_DETAIL_RESULT
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   MERCHANET            VARCHAR(50),
   TERMINAL             VARCHAR(50),
   BATCH_NO             VARCHAR(20),
   AMT                  NUMERIC(17,2),
   CLEAR_AMT            NUMERIC(17,2),
   ACCOUNT              VARCHAR(50),
   CARD_TYPE            VARCHAR(20),
   CARD_BANK_CODE       VARCHAR(20),
   TRADE_TYPE           CHAR(2),
   TRADE_NO             VARCHAR(50),
   TRADE_DATE           CHAR(10),
   TRADE_TIME           CHAR(8),
   CLEAR_DATE           CHAR(10),
   HWP_NO               VARCHAR(32),
   HWPTIME              DATETIME,
   HWP_AMT              NUMERIC(17,2),
   HWP_CODE             VARCHAR(50),
   HWP_CHECK_TIME       DATETIME,
   HWP_CHECK_TYPE       CHAR(1),
   HWP_CHECK_STATUS     CHAR(1),
   HWP_DEAL_STATUS      CHAR(1),
   HWP_DEAL_TIME        DATETIME,
   HWP_DEAL_OPT         VARCHAR(200),
   HWP_DEAL_TYPE        CHAR(1),
   THRID_NO             VARCHAR(32),
   THRID_TIME           DATETIME,
   THRID_AMT            NUMERIC(17,2),
   THRID_CODE           VARCHAR(50),
   THRID_CHECK_TIME     DATETIME,
   THRID_CHECK_TYPE     CHAR(1),
   THRID_CHECK_STATUS   CHAR(1),
   THRID_DEAL_STATUS    CHAR(1),
   THRID_DEAL_TIME      DATETIME,
   THRID_DEAL_OPT       VARCHAR(200),
   THRID_DEAL_TYPE      CHAR(1),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHECK_DETAIL_WXPAY                                */
/*==============================================================*/
CREATE TABLE PAY_CHECK_DETAIL_WXPAY
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   TRADE_TIME           VARCHAR(20),
   APP_ID               VARCHAR(32),
   MCH_ID               VARCHAR(32),
   CHILD_MCH_ID         VARCHAR(32),
   DEVICE_INFO          VARCHAR(32),
   TRADE_NO             VARCHAR(32),
   OUT_TRADE_NO         VARCHAR(32),
   OPEN_ID              VARCHAR(128),
   TRADE_TYPE           VARCHAR(20),
   TRADE_STATUS         VARCHAR(20),
   BANK_TYPE            VARCHAR(20),
   FEE_TYPE             VARCHAR(10),
   TOTAL_FEE            NUMERIC(17,2),
   MP_COUPON_FEE        NUMERIC(17,2),
   REF_TRADE_NO         VARCHAR(32),
   REF_OUT_TRADE_NO     VARCHAR(50),
   REFUND_FEE           NUMERIC(17,2),
   MR_COUPON_FEE        NUMERIC(17,2),
   REF_TYPE             VARCHAR(20),
   REF_STATUS           VARCHAR(20),
   BODY                 VARCHAR(128),
   ATTACH               VARCHAR(128),
   FEE                  NUMERIC(17,2),
   FEE_RATE             VARCHAR(10),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_CHECK_RECORD                                      */
/*==============================================================*/
CREATE TABLE PAY_CHECK_RECORD
(
   ID                   CHAR(32) NOT NULL,
   PC_ID                CHAR(32),
   CHK_DATE             CHAR(10),
   CHK_TYPE             CHAR(1) COMMENT '0 - all
                        1 - 支付
                        2 - 退款',
   CHK_FILE             VARCHAR(200),
   OPT_TYPE             CHAR(1) COMMENT '0 - 系统自动
                        1 - 手工',
   OPTERATOR            VARCHAR(50),
   TOTAL                NUMERIC(10,0) COMMENT '总记录数',
   AMT                  NUMERIC(17,2),
   SUCCESS_TOTAL        NUMERIC(10,0),
   SUCCESS_AMT          NUMERIC(17,2),
   SYNC_NUM             NUMERIC(10,0),
   SYNC_TYPE            VARCHAR(10) COMMENT 'socket
                        ftp
                        http
                        https
                        query',
   SYNC_TIME            DATETIME,
   IMP_TIME             DATETIME,
   CHK_TIME             DATETIME,
   STATUS               CHAR(1) COMMENT 'A - 初始
                        0 - 对账完成
                        1 - 已同步对账文件
                        2 - 同步文件失败',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_SETTLEMENT                                        */
/*==============================================================*/
CREATE TABLE PAY_SETTLEMENT
(
   ID                   CHAR(32) NOT NULL,
   SETTLE_NO            VARCHAR(50),
   SETTLE_TYPE          CHAR(2),
   AMT                  NUMERIC(17,2),
   REAL_AMT             NUMERIC(17,2),
   ORI_AMT              NUMERIC(17,2),
   SETTLE_TITLE         VARCHAR(200),
   SETTLE_DESC          VARCHAR(500),
   APP_CHANNEL          CHAR(2),
   APP_ID               CHAR(32),
   APP_NAME             VARCHAR(50),
   TERMINAL_ID          CHAR(32),
   TERMINAL_CODE        VARCHAR(50),
   TERMINAL_NAME        VARCHAR(70),
   TERMINAL_USER        VARCHAR(50),
   PAY_CHANNEL_ID       CHAR(32),
   PAY_CHANNEL_CODE     VARCHAR(20),
   PAY_CHANNEL_NAME     VARCHAR(50),
   PAY_TYPE_ID          CHAR(32),
   PAY_TYPE_CODE        VARCHAR(20),
   PAY_TYPE_NAME        VARCHAR(50),
   PAYER_NO             VARCHAR(50),
   PAYER_NAME           VARCHAR(70),
   PAYER_ACCOUNT        VARCHAR(50),
   PAYER_ACCT_TYPE      CHAR(1),
   PAYER_ACCT_BANK      VARCHAR(20),
   PAYER_PHONE          VARCHAR(20),
   PAYER_LOGIN          VARCHAR(50),
   TRADE_TERMINAL       CHAR(32),
   TRADE_TERMINAL_CODE  VARCHAR(50),
   TRADE_NO             VARCHAR(50),
   TRADE_TIME           DATETIME,
   TRADE_STATUS         VARCHAR(20),
   TRADE_RSP_CODE       VARCHAR(50),
   TRADE_RSP_MSG        VARCHAR(500),
   FINISH_TIME          DATETIME,
   OUT_TIME             VARCHAR(20),
   BILL_ID              CHAR(32),
   ORI_SETTLE_ID        CHAR(32),
   CHECK_STAT           CHAR(1),
   CHECK_TIME           DATETIME,
   SYNC_NUM             NUMERIC(10,0),
   QR_CODE              VARCHAR(200),
   RESP_TEXT            TEXT,
   PRINT_STAT           CHAR(1),
   PRINT_BATCH_NO       VARCHAR(50),
   FLAG                 CHAR(32),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: PAY_TYPE                                              */
/*==============================================================*/
CREATE TABLE PAY_TYPE
(
   ID                   CHAR(32) NOT NULL,
   PAY_CHANEEL_ID       CHAR(32),
   NAME                 VARCHAR(50),
   CODE                 VARCHAR(20),
   DESCRIPTION          VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

