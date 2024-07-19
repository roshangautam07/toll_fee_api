export function updateRequest(req, apkInfo) {
    return {
        app_name: req?.file?.filename,
        device_vendor:req?.body?.device_vendor,
        versionCode: apkInfo?.versionCode,
        versionName: apkInfo?.versionName,
        compileSdkVersion: apkInfo?.compileSdkVersion,
        compileSdkVersionCodename: apkInfo?.compileSdkVersionCodename,
        package: apkInfo?.package,
        platformBuildVersionCode: apkInfo?.platformBuildVersionCode,
        platformBuildVersionName: apkInfo?.platformBuildVersionName,
        remarks: req?.body?.remarks,
        is_force_update:req?.body?.is_force_update
    };
}