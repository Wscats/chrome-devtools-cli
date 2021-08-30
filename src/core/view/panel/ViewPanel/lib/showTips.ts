const showTips = () => {
    let i = 0;
    let timer = setInterval(() => {
        if (!window.T_SHEET) {
            clearInterval(timer);
            return;
        }
        window.console.log(window.T_SHEET);
        window.console.log(i);
        [
            // showSaveFrontEndErrorTip 60003 60016 60017 40002 40003 40030
            () => {
                window.T_SHEET.ErrorCodeModal.client.showSaveFrontEndErrorTip('60003');
            },
            // showFileNotExsitErrorTip
            () => {
                window.T_SHEET.ErrorCodeModal.client.showFileNotExsitErrorTip('40001');
            },
            // showLoginExpiredTip
            () => {
                window.T_SHEET.ErrorCodeModal.client.showLoginExpiredTip('60006');
            },
            // showUnAuthTip 60007 60015
            () => {
                window.T_SHEET.ErrorCodeModal.client.showUnAuthTip('60007');
            },
            // showBigDataFromFrontTip C0001 C0002
            () => {
                window.T_SHEET.ErrorCodeModal.client.showBigDataFromFrontTip(
                    'C0002',
                    '数据量较大，操作不成功'
                );
            },
            // showSecurityTip
            () => {
                window.T_SHEET.ErrorCodeModal.client.showSecurityTip('40025');
            },
            // showSheetBarDuplicateSheetId
            () => {
                window.T_SHEET.ErrorCodeModal.client.showSheetBarDuplicateSheetId(
                    '888888',
                    'insertNewSheet'
                );
            },
            // window.T_SHEET.ErrorCodeModal.client.showPermissionChangesTip();
            // showCommonErrorModal1
            () => {
                window.T_SHEET.ErrorCodeModal.client.showCommonErrorModal1('通用错误提示modal1');
            },
            // showCommonCrashAndFeedBackModal
            () => {
                window.T_SHEET.ErrorCodeModal.client.showCommonCrashAndFeedBackModal(
                    '通用型的引导反馈的 modal'
                );
            },
            // checkVipToast
            () => {
                window.T_SHEET.ErrorCodeModal.server.checkVipToast('vip', () => {
                    console.log('测试');
                });
            },
            // showServerErrorTip 60000 60001(有可能走这)
            () => {
                window.T_SHEET.ErrorCodeModal.server.showServerErrorTip('60000');
            },
            // showServerConnectTimeout 60002
            () => {
                window.T_SHEET.ErrorCodeModal.server.showServerConnectTimeout('60002');
            },
            // showServerTaskTimeout 服务器处理超时 60022
            () => {
                window.T_SHEET.ErrorCodeModal.server.showServerTaskTimeout('60022');
            },
            // showFullMemberTip
            () => {
                window.T_SHEET.ErrorCodeModal.server.showFullMemberTip('满员');
            },
            // showFullMemberTipWithRefresh
            () => {
                window.T_SHEET.ErrorCodeModal.server.showFullMemberTipWithRefresh('INACTIVE');
            },
            // showBigDataFromServerTip 60008 40026 40028
            () => {
                window.T_SHEET.ErrorCodeModal.server.showBigDataFromServerTip('40026');
            },
            // showFrequentEditTip 60014
            () => {
                window.T_SHEET.ErrorCodeModal.server.showFrequentEditTip('60014');
            },
            // showSaveBackEndErrorTip 40000 40005 40006 40020 40022 40023 40035 40036 40037 41001 41002 10000 10001
            () => {
                window.T_SHEET.ErrorCodeModal.server.showSaveBackEndErrorTip('40000');
            },
            // showUpgradeTip
            () => {
                window.T_SHEET.ErrorCodeModal.server.showUpgradeTip('40034');
            },
            // showUpdatePadTip
            // ()=>{window.T_SHEET.ErrorCodeModal.server.showUpdatePadTip()},
            // showApplyNewChangeErrorTip
            () => {
                window.T_SHEET.ErrorCodeModal.server.showApplyNewChangeErrorTip('aaaaaa');
            },
            // switchSheetError
            () => {
                window.T_SHEET.ErrorCodeModal.server.switchSheetError('aaaaa');
            },
            () => {
                clearInterval(timer);
            }
        ][i]();
        i += 1;
    }, 1000);
};

export default showTips;
