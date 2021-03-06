USE [InstantPayment]
GO
INSERT [dbo].[REG_FEE_RECEIVER] ([RECEIVER_ID], [RECEIVER_NAME]) VALUES (1, N'NBS - IPS')
INSERT [dbo].[REG_FEE_RECEIVER] ([RECEIVER_ID], [RECEIVER_NAME]) VALUES (2, N'Trgovačka')
INSERT [dbo].[REG_FEE_RECEIVER] ([RECEIVER_ID], [RECEIVER_NAME]) VALUES (3, N'Međubankarska')
INSERT [dbo].[REG_FEE_TYPE] ([REG_FEE_TYPE_ID], [REG_FEE_TYPE_NAME]) VALUES (0, N'Fiksni')
INSERT [dbo].[REG_FEE_TYPE] ([REG_FEE_TYPE_ID], [REG_FEE_TYPE_NAME]) VALUES (1, N'Procentualni')
INSERT [dbo].[REG_PRODUCT_TYPE] ([TYPE_ID], [TYPE_NAME]) VALUES (1, N'on-us')
INSERT [dbo].[REG_PRODUCT_TYPE] ([TYPE_ID], [TYPE_NAME]) VALUES (2, N'off-us')
SET IDENTITY_INSERT [dbo].[REG_FEE_RULES] ON 

INSERT [dbo].[REG_FEE_RULES] ([FEE_ID], [MERCHANT_ID], [FEE_TYPE], [FEE_RECEIVER_ID], [FEE_CONDITION], [FEE_AMOUNT], [PRODUCT_TYPE_ID], [VALIDITY_DATE]) VALUES (1, 25, 0, 2, 1, 0, 1, NULL)
INSERT [dbo].[REG_FEE_RULES] ([FEE_ID], [MERCHANT_ID], [FEE_TYPE], [FEE_RECEIVER_ID], [FEE_CONDITION], [FEE_AMOUNT], [PRODUCT_TYPE_ID], [VALIDITY_DATE]) VALUES (4, 1, 1, 1, 0, 0.5, 1, NULL)
INSERT [dbo].[REG_FEE_RULES] ([FEE_ID], [MERCHANT_ID], [FEE_TYPE], [FEE_RECEIVER_ID], [FEE_CONDITION], [FEE_AMOUNT], [PRODUCT_TYPE_ID], [VALIDITY_DATE]) VALUES (5, 43, 1, 2, 0, 0.20000000298023224, 1, NULL)
INSERT [dbo].[REG_FEE_RULES] ([FEE_ID], [MERCHANT_ID], [FEE_TYPE], [FEE_RECEIVER_ID], [FEE_CONDITION], [FEE_AMOUNT], [PRODUCT_TYPE_ID], [VALIDITY_DATE]) VALUES (6, 43, 1, 2, 0, 2, 2, NULL)
SET IDENTITY_INSERT [dbo].[REG_FEE_RULES] OFF
SET IDENTITY_INSERT [dbo].[REG_COUNTRIES] ON 

INSERT [dbo].[REG_COUNTRIES] ([country_id], [country_code], [country_name]) VALUES (1, N'RS', N'Srbija')
SET IDENTITY_INSERT [dbo].[REG_COUNTRIES] OFF
SET IDENTITY_INSERT [dbo].[REG_CITIES] ON 

INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (1, N'11000', N'Beograd', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (2, N'21000', N'Novi Sad', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (3, N'18000', N'Niš', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (4, N'26000', N'Subotica', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (5, N'test code', N'test code', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (6, N'nemanja', N'nemanja', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (18, N'11070', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (19, N'11007', N'Test1234', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (25, N'11300', N'Smederevo', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (26, N'22300', N'Stara Pazova', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (27, N'11080', N'Zemun', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (28, N'25260', N'Apatin', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (29, N'34000', N'Kragujevac', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (30, N'31230', N'Arilje', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (31, N'11211', N'Borca', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (32, N'11071', N'', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (33, N'22222', N'da', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (35, N'11223', N'Beli Potok', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (43, N'37000', N'Kruska', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (49, N'11090', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (50, N'23300', N'KIKINDA', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (51, N'25000', N'SOMBOR', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (52, N'31000', N'UŽICE', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (53, N'456', N'g3', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (54, N'11', N'dfvdfv', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (55, N'11102', N'BEOGRAD', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (56, N'345345', N'afvsdf', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (57, N'11050', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (58, N'25230', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (59, N'12208', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (60, N'11104', NULL, 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (61, N'14240', N'Ljig', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (62, N'11230', N'Beograd', 1)
INSERT [dbo].[REG_CITIES] ([city_id], [city_code], [city_name], [country_id]) VALUES (65, N'1133', N'asdagsd', 1)
SET IDENTITY_INSERT [dbo].[REG_CITIES] OFF
SET IDENTITY_INSERT [dbo].[GROUPS] ON 

INSERT [dbo].[GROUPS] ([GROUP_ID], [GROUPNAME], [DESCRIPTION]) VALUES (1, N'ADMIN', N'Admin Group')
INSERT [dbo].[GROUPS] ([GROUP_ID], [GROUPNAME], [DESCRIPTION]) VALUES (2, N'USER', N'User')
INSERT [dbo].[GROUPS] ([GROUP_ID], [GROUPNAME], [DESCRIPTION]) VALUES (3, N'ACQ', N'ACQ Network')
SET IDENTITY_INSERT [dbo].[GROUPS] OFF
SET IDENTITY_INSERT [dbo].[USERS] ON 

INSERT [dbo].[USERS] ([USER_ID], [username], [email], [password], [is_approved], [full_name]) VALUES (1, N'pavel', N'nenad.vukojevic@payten.com', N'miroslava', 1, N'Nenad Vukojevic')
SET IDENTITY_INSERT [dbo].[USERS] OFF
INSERT [dbo].[USER_GROUPS] ([user_id], [group_id]) VALUES (1, 1)
SET IDENTITY_INSERT [dbo].[ROLES] ON 

INSERT [dbo].[ROLES] ([ROLE_ID], [ROLENAME], [DESCRIPTION]) VALUES (1, N'ROLE_ADMIN', N'Administrator')
INSERT [dbo].[ROLES] ([ROLE_ID], [ROLENAME], [DESCRIPTION]) VALUES (2, N'ROLE_USER', N'User')
INSERT [dbo].[ROLES] ([ROLE_ID], [ROLENAME], [DESCRIPTION]) VALUES (3, N'ROLE_ACQ', N'Admin ACQ Network')
SET IDENTITY_INSERT [dbo].[ROLES] OFF
INSERT [dbo].[GROUP_ROLES] ([GROUP_ID], [ROLE_ID]) VALUES (1, 1)
INSERT [dbo].[GROUP_ROLES] ([GROUP_ID], [ROLE_ID]) VALUES (1, 2)
INSERT [dbo].[GROUP_ROLES] ([GROUP_ID], [ROLE_ID]) VALUES (1, 3)
INSERT [dbo].[GROUP_ROLES] ([GROUP_ID], [ROLE_ID]) VALUES (2, 2)
INSERT [dbo].[GROUP_ROLES] ([GROUP_ID], [ROLE_ID]) VALUES (3, 3)
INSERT [dbo].[ACQ_PAYMENT_METHODS] ([PAYMENT_METHOD_ID], [PAYMENT_METHOD_NAME]) VALUES (N'A', N'')
INSERT [dbo].[ACQ_PAYMENT_METHODS] ([PAYMENT_METHOD_ID], [PAYMENT_METHOD_NAME]) VALUES (N'P', N'Present')
INSERT [dbo].[ACQ_PAYMENT_METHODS] ([PAYMENT_METHOD_ID], [PAYMENT_METHOD_NAME]) VALUES (N'S', N'Scan')
INSERT [dbo].[ACQ_STATUS] ([status_id], [status_name]) VALUES (N'100', N'Active')
INSERT [dbo].[ACQ_STATUS] ([status_id], [status_name]) VALUES (N'200', N'Inactive')
INSERT [dbo].[ACQ_STATUS] ([status_id], [status_name]) VALUES (N'300', N'Deactivated')
INSERT [dbo].[ACQ_STATUS] ([status_id], [status_name]) VALUES (N'400', N'Suspended')
INSERT [dbo].[ACQ_TERMINALS_TYPE] ([terminal_type_id], [terminal_type_name]) VALUES (1, N'Android')
INSERT [dbo].[ACQ_TERMINALS_TYPE] ([terminal_type_id], [terminal_type_name]) VALUES (2, N'POSTerminal')
INSERT [dbo].[ACQ_TERMINALS_TYPE] ([terminal_type_id], [terminal_type_name]) VALUES (3, N'PKS')
INSERT [dbo].[ACQ_TERMINALS_TYPE] ([terminal_type_id], [terminal_type_name]) VALUES (4, N'eCommerce')
