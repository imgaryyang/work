/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/12/15 11:13:54                          */
/*==============================================================*/


DROP TABLE IF EXISTS HWE_ACCOUNT;

DROP TABLE IF EXISTS HWE_DEPT;

DROP TABLE IF EXISTS HWE_DEPT_POST;

DROP TABLE IF EXISTS HWE_MENU;

DROP TABLE IF EXISTS HWE_ORG;

DROP TABLE IF EXISTS HWE_POST;

DROP TABLE IF EXISTS HWE_ROLE;

DROP TABLE IF EXISTS HWE_ROLE_MENU;

DROP TABLE IF EXISTS HWE_USER;

DROP TABLE IF EXISTS HWE_USER_DEPT;

DROP TABLE IF EXISTS HWE_USER_ORG;

DROP TABLE IF EXISTS HWE_USER_POST;

DROP TABLE IF EXISTS HWE_USER_ROLE;

/*==============================================================*/
/* Table: HWE_ACCOUNT                                           */
/*==============================================================*/
CREATE TABLE HWE_ACCOUNT
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32),
   USERNAME             VARCHAR(100),
   PASSWORD             VARCHAR(100),
   NAME                 VARCHAR(100),
   MOBILE               VARCHAR(20),
   EMAIL                VARCHAR(50),
   OTHER_CONTACT_WAY    VARCHAR(100),
   TYPE                 CHAR(1),
   STATUS               CHAR(1) COMMENT '1 - 正常
            2 - 冻结',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_DEPT                                              */
/*==============================================================*/
CREATE TABLE HWE_DEPT
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(32),
   CODE                 VARCHAR(50) NOT NULL COMMENT '便于程序编码实现的代码',
   DESCRIPTION          VARCHAR(255),
   ORG_ID               CHAR(32),
   PARENT_ID            CHAR(32),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_DEPT_POST                                         */
/*==============================================================*/
CREATE TABLE HWE_DEPT_POST
(
   DID                  CHAR(32),
   PID                  CHAR(32)
);

/*==============================================================*/
/* Table: HWE_MENU                                              */
/*==============================================================*/
CREATE TABLE HWE_MENU
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(25),
   NAME                 VARCHAR(50),
   TYPE                 CHAR(1),
   DESCP                VARCHAR(255),
   ICON                 VARCHAR(255),
   URI                  VARCHAR(255),
   SORTER               INT,
   PARENT_ID            CHAR(32),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_ORG                                               */
/*==============================================================*/
CREATE TABLE HWE_ORG
(
   ID                   CHAR(32) NOT NULL,
   CUST_CODE            CHAR(16),
   BRC_CODE             VARCHAR(50),
   NAME                 VARCHAR(70),
   EN_NAME              VARCHAR(50),
   SHORT_NAME           VARCHAR(50),
   ID_TYPE              CHAR(2),
   ID_NO                VARCHAR(50),
   VISA_DATE            CHAR(10),
   EFFECTIVE_DATE       CHAR(10),
   EXPIRED_DATE         CHAR(10),
   VISA_ADDR            VARCHAR(255),
   CATEGRY              VARCHAR(50),
   TYPE                 CHAR(10),
   TYPE2                CHAR(10) COMMENT '类别码
            第一位：1-代发 0-非代发
            第二位：1-易健康接入医院 0-非易健康接入医院
            第三位：1-易健康接入药店 0-非易健康接入药店
            第四位：1-收费机构 0-非收费机构
            第五位：1/0 是否社保
            第六位：1/0 是否卫计委
            第七位：1/0 是否合作银行
            第八位：1/0 是否平台运营机构
            ',
   ORG_NO               VARCHAR(50),
   LICNUM               VARCHAR(50),
   SI_ID                VARCHAR(50),
   EMPLOYEES            INT,
   REGISTERED_CAPITAL   NUMERIC(10,0),
   AREA_CODE            CHAR(6),
   AREA_NAME            VARCHAR(255),
   MEMO                 VARCHAR(500),
   PARENT               CHAR(32),
   LVL                  INT,
   CASCAD               VARCHAR(50),
   IS_LEAF              CHAR(1),
   PHONE                VARCHAR(50),
   PHONE1               VARCHAR(50),
   MOBILE               VARCHAR(50),
   MOBILE1              VARCHAR(50),
   ZIP                  CHAR(6),
   PROVINCE             CHAR(6),
   CITY                 CHAR(6),
   ADDRESS              VARCHAR(255),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_POST                                              */
/*==============================================================*/
CREATE TABLE HWE_POST
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   ORG_ID               CHAR(32),
   PARENT_ID            CHAR(32),
   MEMO                 VARCHAR(255),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_ROLE                                              */
/*==============================================================*/
CREATE TABLE HWE_ROLE
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(100),
   CODE                 VARCHAR(50),
   MEMO                 VARCHAR(255),
   ORG_ID               CHAR(32),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_ROLE_MENU                                         */
/*==============================================================*/
CREATE TABLE HWE_ROLE_MENU
(
   RID                  CHAR(32) NOT NULL,
   MID                  CHAR(32) NOT NULL,
   PRIMARY KEY (RID, MID)
);

/*==============================================================*/
/* Table: HWE_USER                                              */
/*==============================================================*/
CREATE TABLE HWE_USER
(
   ID                   CHAR(32) NOT NULL,
   CUST_CODE            CHAR(16),
   USER_CODE            CHAR(8),
   TYPE                 CHAR(1),
   NAME                 VARCHAR(70),
   EN_NAME              VARCHAR(50),
   SHORT_NAME           VARCHAR(50),
   ID_TYPE              CHAR(2),
   ID_NO                VARCHAR(50),
   EFFECTIVE_DATE       CHAR(10),
   EXPIRED_DATE         CHAR(10),
   VISA_DATE            CHAR(10),
   VISA_ADDR            VARCHAR(100),
   SI_ID                CHAR(20),
   HOME_PLACE           VARCHAR(100),
   BORN_DATE            VARCHAR(20),
   GENDER               VARCHAR(10),
   FOLK                 VARCHAR(10),
   MARR_STATUS          CHAR(1),
   EDU_LEVEL            VARCHAR(50),
   PHONE                VARCHAR(50),
   PHONE1               VARCHAR(50),
   MOBILE               VARCHAR(50),
   MOBILE1              VARCHAR(50),
   ZIP                  CHAR(6),
   PROVINCE             CHAR(6),
   CITY                 CHAR(6),
   ADDRESS              VARCHAR(100),
   MAIL                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   IS_ACTIVE            VARCHAR(1) DEFAULT '0',
   IS_EXPE              VARCHAR(1) DEFAULT '0',
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_USER_DEPT                                         */
/*==============================================================*/
CREATE TABLE HWE_USER_DEPT
(
   DID                  CHAR(32) NOT NULL,
   UID                  CHAR(32) NOT NULL,
   PRIMARY KEY (DID, UID)
);

/*==============================================================*/
/* Table: HWE_USER_ORG                                          */
/*==============================================================*/
CREATE TABLE HWE_USER_ORG
(
   ID                   CHAR(32) NOT NULL,
   USER_ID              CHAR(32) NOT NULL,
   ORG_ID               CHAR(32) NOT NULL,
   IS_REG               CHAR(1),
   EFFON                DATETIME NOT NULL,
   OFFON                DATETIME,
   STATUS               CHAR(1) NOT NULL,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: HWE_USER_POST                                         */
/*==============================================================*/
CREATE TABLE HWE_USER_POST
(
   PTID                 CHAR(32) NOT NULL,
   UID                  CHAR(32) NOT NULL,
   PRIMARY KEY (PTID, UID)
);

/*==============================================================*/
/* Table: HWE_USER_ROLE                                         */
/*==============================================================*/
CREATE TABLE HWE_USER_ROLE
(
   UID                  CHAR(32) NOT NULL,
   RID                  CHAR(32) NOT NULL,
   PRIMARY KEY (UID, RID)
);

ALTER TABLE HWE_ACCOUNT ADD CONSTRAINT FK_ACCOUNT_USER FOREIGN KEY (USER_ID)
      REFERENCES HWE_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_DEPT ADD CONSTRAINT FK_DEPT_ORG FOREIGN KEY (ORG_ID)
      REFERENCES HWE_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_DEPT ADD CONSTRAINT FK_DEPT_PARENT FOREIGN KEY (PARENT_ID)
      REFERENCES HWE_DEPT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_DEPT_POST ADD CONSTRAINT FK_DEPTPOST_DEPT FOREIGN KEY (DID)
      REFERENCES HWE_DEPT (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_DEPT_POST ADD CONSTRAINT FK_DEPTPOST_POST FOREIGN KEY (PID)
      REFERENCES HWE_POST (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_MENU ADD CONSTRAINT FK_MENU_PARENT FOREIGN KEY (PARENT_ID)
      REFERENCES HWE_MENU (ID) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE HWE_POST ADD CONSTRAINT FK_POST_ORG FOREIGN KEY (ORG_ID)
      REFERENCES HWE_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_POST ADD CONSTRAINT FK_POST_PARENT FOREIGN KEY (PARENT_ID)
      REFERENCES HWE_POST (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_ROLE ADD CONSTRAINT FK_ROLE_ORG FOREIGN KEY (ORG_ID)
      REFERENCES HWE_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_ROLE_MENU ADD CONSTRAINT FK_ROLEMENU_MENU FOREIGN KEY (MID)
      REFERENCES HWE_MENU (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_ROLE_MENU ADD CONSTRAINT FK_ROLEMENU_ROLE FOREIGN KEY (RID)
      REFERENCES HWE_ROLE (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_DEPT ADD CONSTRAINT FK_USERDEPT_DEPT FOREIGN KEY (DID)
      REFERENCES HWE_DEPT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_DEPT ADD CONSTRAINT FK_USERDEPT_USER FOREIGN KEY (UID)
      REFERENCES HWE_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_ORG ADD CONSTRAINT FK_USERORG_ORG FOREIGN KEY (ORG_ID)
      REFERENCES HWE_ORG (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_ORG ADD CONSTRAINT FK_USERORG_USER FOREIGN KEY (USER_ID)
      REFERENCES HWE_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_POST ADD CONSTRAINT FK_USERPOST_POST FOREIGN KEY (PTID)
      REFERENCES HWE_POST (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_POST ADD CONSTRAINT FK_USERPOST_USER FOREIGN KEY (UID)
      REFERENCES HWE_USER (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_ROLE ADD CONSTRAINT FK_USERROLE_ROLE FOREIGN KEY (RID)
      REFERENCES HWE_ROLE (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE HWE_USER_ROLE ADD CONSTRAINT FK_USERROLE_USER FOREIGN KEY (UID)
      REFERENCES HWE_USER (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

