/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/12/15 11:14:32                          */
/*==============================================================*/


DROP TABLE IF EXISTS SSM_MACHINE;

DROP TABLE IF EXISTS SSM_MACHINE_ROLE;

DROP TABLE IF EXISTS SSM_MATERIAL;

DROP TABLE IF EXISTS SSM_MATERIAL_IN;

DROP TABLE IF EXISTS SSM_MATERIAL_OUT;

DROP TABLE IF EXISTS SSM_MODEL;

DROP TABLE IF EXISTS SSM_TROUBLE;

DROP TABLE IF EXISTS SSM_TROUBLE_DETAIL;

/*==============================================================*/
/* Table: SSM_MACHINE                                           */
/*==============================================================*/
CREATE TABLE SSM_MACHINE
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(70),
   HOSPITAL_NO          VARCHAR(50),
   HOSPITAL_NAME        VARCHAR(50),
   AREA_ID              CHAR(32),
   AREA_NAME            VARCHAR(50),
   MNG_ID               CHAR(32),
   MNG_CODE             VARCHAR(50),
   MNG_NAME             VARCHAR(50),
   MNG_TYPE             VARCHAR(20),
   MAC                  VARCHAR(20),
   IP                   VARCHAR(50),
   MODEL_ID             CHAR(32),
   MODEL_CODE           VARCHAR(50),
   SUPPLIER             VARCHAR(50),
   MEDICAL_RECORDS      INT,
   IS_MEDICAL_RECORD    CHAR(1),
   CARD_RECORDS         INT,
   IS_CARD_RECORD       CHAR(1),
   A4_RECORDS           INT,
   IS_A4_RECORD         CHAR(1),
   A5_RECORDS           INT,
   IS_A5_RECORD         CHAR(1),
   DESCRIPTION          VARCHAR(100),
   HIS_USER             VARCHAR(50),
   AREA_CODE            VARCHAR(20),
   CASH_BOX_SERIAL      VARCHAR(20),
   FLOOR                VARCHAR(20),
   BUILDING             VARCHAR(20),
   SCH_NO               VARCHAR(20),
   OPERATOR_NAME        VARCHAR(20),
   OPERATOR_MOBILE      VARCHAR(20),
   CASHBOX              CHAR(1),
   ADDRESS              VARCHAR(30),
   MONITOR_STATE        VARCHAR(20),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: SSM_MACHINE_ROLE                                      */
/*==============================================================*/
CREATE TABLE SSM_MACHINE_ROLE
(
   ROLE_ID              CHAR(32) NOT NULL,
   MACHINE_ID           CHAR(32) NOT NULL,
   PRIMARY KEY (ROLE_ID, MACHINE_ID)
);

/*==============================================================*/
/* Table: SSM_MATERIAL                                          */
/*==============================================================*/
CREATE TABLE SSM_MATERIAL
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(20),
   UNIT                 VARCHAR(20),
   SUPPLIER             VARCHAR(50),
   ACCOUNT              INT,
   REMARK               VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: SSM_MATERIAL_IN                                       */
/*==============================================================*/
CREATE TABLE SSM_MATERIAL_IN
(
   ID                   CHAR(32) NOT NULL,
   IN_PUT_ACCOUNT       INT,
   IN_PUT_TIME          DATETIME,
   MATERIAL_ID          CHAR(32),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50)
);

/*==============================================================*/
/* Table: SSM_MATERIAL_OUT                                      */
/*==============================================================*/
CREATE TABLE SSM_MATERIAL_OUT
(
   ID                   CHAR(32) NOT NULL,
   OUT_PUT_ACCOUNT      INT,
   OUT_PUT_TIME         DATETIME,
   MACHINE_ID           CHAR(32),
   MATERIAL_ID          CHAR(32),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: SSM_MODEL                                             */
/*==============================================================*/
CREATE TABLE SSM_MODEL
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(20),
   NAME                 VARCHAR(20),
   SORT                 INT,
   PARENT_ID            CHAR(32),
   SUPPLIER             VARCHAR(100),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: SSM_TROUBLE                                           */
/*==============================================================*/
CREATE TABLE SSM_TROUBLE
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(30),
   PARENT_ID            CHAR(32),
   SORT                 INT,
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: SSM_TROUBLE_DETAIL                                    */
/*==============================================================*/
CREATE TABLE SSM_TROUBLE_DETAIL
(
   ID                   CHAR(32) NOT NULL,
   TROUBLE_ID           CHAR(32),
   MACHINE_ID           CHAR(32),
   DEAL_WAY             VARCHAR(200),
   DESCRIPTION          VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'A  - 初始
            0 - 正常
            1 - 已屏蔽',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   PRIMARY KEY (ID)
);

