
//根据设备类型 在树中显示相应的图片
function showTreeNodeImageByDeviceType(zNode){
    var type = zNode.fd_dev_class_id;
    if (type == 1) {
        zNode.icon = "../resource/images/a_dz.png";
    } else if (type == 2) {
        zNode.icon = "../resource/images/a_bwd.png";
    } else if (type == 3 || type == 0) {
        zNode.icon = "../resource/images/bar.png";
    } else if (type == 4) {
        zNode.icon = "../resource/images/a_xb.png";
    } else if (type == 5) {
        zNode.icon = "../resource/images/a_hjjcy.png";
    } else if (type == 6) {
        zNode.icon = "../resource/images/a_dy.png";
    } else if (type == 7) {
        zNode.icon = "../resource/images/a_db.png";
    } else if (type == 8) {
        zNode.icon = "../resource/images/a_xlbhzz.png";
    } else if (type == 9) {
        zNode.icon = "../resource/images/a_txzz.png";
    } else if (type == 10) {
        zNode.icon = "../resource/images/a_dcb.png";
    } else if (type == 11) {
        zNode.icon = "../resource/images/a_hjjcy.png";
    } else if (type == 12) {
        zNode.icon = "../resource/images/a_xlbhzz.png";
    } else if (type == 13) {
        zNode.icon = "../resource/images/a_jlzz.png";
    } else if (type == 14) {
        zNode.icon = "../resource/images/a_cnblq.png";
    } else if (type == 16) {
        zNode.icon = "../resource/images/a_jlzz.png";
    } else if (type == 17) {
        zNode.icon = "../resource/images/a_dy.png";
    } else if (type == 18) {
        zNode.icon = "../resource/images/a_cgq.png";
    } else if (type == 22) {
        zNode.icon = "../resource/images/a_gprs.png";
    }
}
