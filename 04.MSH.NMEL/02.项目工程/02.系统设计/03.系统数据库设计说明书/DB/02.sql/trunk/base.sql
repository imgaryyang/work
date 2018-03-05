/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2016/7/11 15:51:50                           */
/*==============================================================*/


DROP TABLE IF EXISTS EL_ADDRESS;

DROP TABLE IF EXISTS EL_AREA;

DROP TABLE IF EXISTS EL_BANKS;

DROP TABLE IF EXISTS EL_BANK_BRANCH;

DROP TABLE IF EXISTS EL_BANK_CARDS;

DROP TABLE IF EXISTS EL_CARD_BIN;

DROP TABLE IF EXISTS EL_CARD_MENU;

DROP TABLE IF EXISTS EL_CARD_TYPE;

DROP TABLE IF EXISTS EL_COMMENT;

DROP TABLE IF EXISTS EL_CONTACT_WAYS;

DROP TABLE IF EXISTS EL_DIC;

DROP TABLE IF EXISTS EL_DIC_ITEM;

DROP TABLE IF EXISTS EL_IMAGES;

DROP TABLE IF EXISTS EL_JOINED_BANK;

DROP TABLE IF EXISTS EL_NEWS;

DROP TABLE IF EXISTS EL_OPT_LOG;

DROP TABLE IF EXISTS EL_SECTIONAL_DESC;

DROP TABLE IF EXISTS EL_TRANSPORTATION;

DROP TABLE IF EXISTS EL_VIRTUAL_ACCOUNT;

/*==============================================================*/
/* Table: EL_ADDRESS                                            */
/*==============================================================*/
CREATE TABLE EL_ADDRESS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   ZIPCODE              CHAR(6),
   AREA_CODE            CHAR(6),
   AREA_NAME            VARCHAR(50),
   ADDRESS              VARCHAR(100) NOT NULL,
   MEMO                 VARCHAR(100),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_AREA                                               */
/*==============================================================*/
CREATE TABLE EL_AREA
(
   ID                   INT(11) NOT NULL,
   PARENT_ID            INT(11) DEFAULT 0,
   NAME                 VARCHAR(50),
   SHORT_NAME           VARCHAR(50),
   LONGITUDE            FLOAT DEFAULT 0,
   LATITUDE             FLOAT DEFAULT 0,
   LEVEL                INT(1) COMMENT '等级(1省/直辖市,2地级市,3区县,4镇/街道)',
   SORT                 INT(3) DEFAULT 1,
   STATUS               INT(1) DEFAULT 0 COMMENT '状态(0禁用/1启用)',
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_BANKS                                              */
/*==============================================================*/
CREATE TABLE EL_BANKS
(
   BANKNO               CHAR(30) NOT NULL,
   BANKTYPE             CHAR(1),
   BANKNAME             VARCHAR(100),
   ICONMINI             VARCHAR(50),
   ICONMIDDLE           VARCHAR(50),
   ICONBIG              VARCHAR(50),
   FULLIMG              VARCHAR(50),
   FIRSTLETTER          CHAR(1),
   PRIMARY KEY (BANKNO)
);

/*==============================================================*/
/* Table: EL_BANK_BRANCH                                        */
/*==============================================================*/
CREATE TABLE EL_BANK_BRANCH
(
   ID                   CHAR(32) NOT NULL,
   BANK_ID              CHAR(32),
   NAME                 VARCHAR(100),
   ADDRESS              VARCHAR(100),
   CONTACT_WAY          VARCHAR(50),
   LONGITUDE            NUMERIC(17,2),
   LATITUDE             NUMERIC(17,2),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_BANK_CARDS                                         */
/*==============================================================*/
CREATE TABLE EL_BANK_CARDS
(
   ID                   CHAR(32) NOT NULL,
   PERSON_ID            CHAR(32),
   TYPE_ID              CHAR(32),
   CARD_NO              CHAR(32),
   CARDHOLDER           VARCHAR(50),
   BANK_ORG_ID          CHAR(32),
   BANK_NO              CHAR(30),
   BANK_NAME            VARCHAR(100),
   BANK_CARD_TYPE       CHAR(1) COMMENT '1 - 储蓄卡
            2 - 信用卡',
   BALANCE              NUMERIC(17,2),
   ORG_ID               CHAR(32),
   ORG_NAME             VARCHAR(100),
   ID_CARD_NO           CHAR(18),
   BINDED_AT            CHAR(19),
   UNBINDED_AT          CHAR(19),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 已解绑',
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_CARD_BIN                                           */
/*==============================================================*/
CREATE TABLE EL_CARD_BIN
(
   ID                   CHAR(32) NOT NULL,
   CARD_BIN             CHAR(6),
   BANK_CARD_TYPE       CHAR(1) COMMENT '1 - 储蓄卡
            2 - 信用卡',
   BANK_NO              CHAR(30),
   BANK_NAME            VARCHAR(100),
   ORG_ID               CHAR(32),
   ORG_NAME             VARCHAR(100),
   CARD_TYPE_ID         CHAR(32),
   CARD_TYPE_NAME       VARCHAR(100),
   CARD_NUM             INT,
   CARD_MEMO            VARCHAR(100),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_CARD_MENU                                          */
/*==============================================================*/
CREATE TABLE EL_CARD_MENU
(
   ID                   CHAR(32) NOT NULL,
   TYPE_ID              CHAR(32),
   CODE                 CHAR(20),
   TEXT                 VARCHAR(20),
   TEXT_SIZE            VARCHAR(3),
   TEXT_COLOR           VARCHAR(40),
   ICON                 VARCHAR(50),
   ICON_SIZE            VARCHAR(3),
   ICON_COLOR           VARCHAR(40),
   IMAGE                VARCHAR(200),
   IMAGE_RESOLUTION     VARCHAR(50),
   CONPONENT            VARCHAR(30),
   ON_CLICK             VARCHAR(30),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_CARD_TYPE                                          */
/*==============================================================*/
CREATE TABLE EL_CARD_TYPE
(
   ID                   CHAR(32) NOT NULL,
   ORG_ID               CHAR(32),
   ORG_NAME             VARCHAR(100),
   TYPE                 CHAR(1) COMMENT '1 - 银行卡
            2 - 社保卡
            3 - 诊疗卡
            4 - 健康卡',
   NAME                 VARCHAR(50),
   PRIMARY KEY (ID)
);

ALTER TABLE EL_CARD_TYPE COMMENT '初始化数据：
1、内蒙古二代社保卡
2、内蒙古健康卡
3、xx医院诊疗卡(n)';

/*==============================================================*/
/* Table: EL_COMMENT                                            */
/*==============================================================*/
CREATE TABLE EL_COMMENT
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(20),
   USER_ID              CHAR(32),
   USER_NAME            VARCHAR(50),
   USER_NICKNAME        VARCHAR(50),
   COMMENT              VARCHAR(500),
   POST_AT              CHAR(19),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 已屏蔽',
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_CONTACT_WAYS                                       */
/*==============================================================*/
CREATE TABLE EL_CONTACT_WAYS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   TYPE                 CHAR(1) NOT NULL COMMENT '1 - 手机号
            2 - 电话
            3 - 传真
            4 - 400电话
            5 - 微信
            6 - 微博
            7 - QQ
            8 - EMAIL',
   CONTENT              VARCHAR(50) NOT NULL,
   MEMO                 VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_DIC                                                */
/*==============================================================*/
CREATE TABLE EL_DIC
(
   ID                   CHAR(32) NOT NULL,
   CODE                 CHAR(50),
   NAME                 VARCHAR(100),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_DIC_ITEM                                           */
/*==============================================================*/
CREATE TABLE EL_DIC_ITEM
(
   ID                   CHAR(32) NOT NULL,
   PARENT_ID            CHAR(32),
   DIC_ID               CHAR(32),
   CODE                 CHAR(32),
   TEXT                 VARCHAR(200),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_IMAGES                                             */
/*==============================================================*/
CREATE TABLE EL_IMAGES
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(2),
   MEMO                 VARCHAR(50),
   PATH                 VARCHAR(200),
   FILE_NAME            VARCHAR(50),
   EXT_NAME             VARCHAR(10),
   RESOLUTION           VARCHAR(50),
   SIZE                 NUMERIC(17,2),
   SORT_NUM             INT COMMENT '同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。',
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_JOINED_BANK                                        */
/*==============================================================*/
CREATE TABLE EL_JOINED_BANK
(
   ID                   CHAR(32) NOT NULL,
   BANK_NO              CHAR(30),
   BANK_NAME            VARCHAR(100),
   SERVICE_PHONE        CHAR(20),
   EFFECTIVE_ON         CHAR(10),
   EXPIRY_ON            CHAR(10),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_NEWS                                               */
/*==============================================================*/
CREATE TABLE EL_NEWS
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) COMMENT '机构id(医院ID)',
   FK_TYPE              CHAR(2) NOT NULL COMMENT 'H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告',
   CAPTION              VARCHAR(100) NOT NULL,
   DIGEST               VARCHAR(300),
   BODY                 VARCHAR(2046) NOT NULL,
   IMAGE                VARCHAR(100) NOT NULL,
   FEEDED_BY            VARCHAR(50),
   STATE                CHAR(1) NOT NULL COMMENT '1 - 正常
            2 - 下线',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           CHAR(19),
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           CHAR(19),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_OPT_LOG                                            */
/*==============================================================*/
CREATE TABLE EL_OPT_LOG
(
   ID                   CHAR(32) NOT NULL,
   OPT_TYPE             CHAR(2),
   OPT_NAME             VARCHAR(30),
   OPT_RESULT           VARCHAR(10),
   OPT_AT               CHAR(19),
   OPT_BY               VARCHAR(50),
   MEMO                 VARCHAR(200),
   MAC                  VARCHAR(20),
   IP                   VARCHAR(20),
   PRIMARY KEY (ID)
);

ALTER TABLE EL_OPT_LOG COMMENT '系统统一日志表，包括：
1、所有机构新建、上线、下线、变更客户专员等
2、所有用户新建、禁用、启';

/*==============================================================*/
/* Table: EL_SECTIONAL_DESC                                     */
/*==============================================================*/
CREATE TABLE EL_SECTIONAL_DESC
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   FK_TYPE              CHAR(20),
   CAPTION              VARCHAR(100),
   BODY                 VARCHAR(500),
   SORT_NUM             INT,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_TRANSPORTATION                                     */
/*==============================================================*/
CREATE TABLE EL_TRANSPORTATION
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32) NOT NULL,
   FK_TYPE              VARCHAR(10),
   TYPE                 CHAR(1) NOT NULL COMMENT '1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他',
   CONTENT              VARCHAR(50) NOT NULL,
   MEMO                 VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: EL_VIRTUAL_ACCOUNT                                    */
/*==============================================================*/
CREATE TABLE EL_VIRTUAL_ACCOUNT
(
   ID                   CHAR(32) NOT NULL,
   FK_ID                CHAR(32),
   ACCT_TYPE            CHAR(2) COMMENT '01 - 虚拟资金账户
            02 - 积分账户
            03 - 信用分账户',
   ACCT_NO              CHAR(32),
   PRIMARY KEY (ID)
);

ALTER TABLE EL_BANK_BRANCH ADD CONSTRAINT FK_REFERENCE_21 FOREIGN KEY (BANK_ID)
      REFERENCES EL_JOINED_BANK (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_BANK_CARDS ADD CONSTRAINT FK_REFERENCE_14 FOREIGN KEY (TYPE_ID)
      REFERENCES EL_CARD_TYPE (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_BANK_CARDS ADD CONSTRAINT FK_REFERENCE_30 FOREIGN KEY (PERSON_ID)
      REFERENCES IH_PERSON (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_CARD_BIN ADD CONSTRAINT FK_REFERENCE_34 FOREIGN KEY (ORG_ID)
      REFERENCES IH_ORG (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_CARD_MENU ADD CONSTRAINT FK_REFERENCE_17 FOREIGN KEY (TYPE_ID)
      REFERENCES EL_CARD_TYPE (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_CARD_TYPE ADD CONSTRAINT FK_REFERENCE_25 FOREIGN KEY (ORG_ID)
      REFERENCES IH_ORG (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE EL_DIC_ITEM ADD CONSTRAINT FK_DICITEM_DIC FOREIGN KEY (DIC_ID)
      REFERENCES EL_DIC (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

