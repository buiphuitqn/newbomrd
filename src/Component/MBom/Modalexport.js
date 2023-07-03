import React from "react";
import {
    Radio,
    Col,
    Modal,
    Row,
    Input,
    Button,
    Mentions,
    notification,
    Select,
    Space,
} from "antd";
import Context from "../../Data/Context";
import axios from "axios";
import "./style.css";
import { SaveOutlined } from "@ant-design/icons";

const exportLevel = (level) => {
    var newLevel = [];
    level.map((item) => {
        var ar = [];
        for (var i = 1; i <= 7; i++) {
            if (i == item) ar.push(1);
            else ar.push(0);
        }
        newLevel.push(ar);
    });
    if (newLevel[0][0] == 0) return [];
    var endlevel = [];
    var leve = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < newLevel.length; i++) {
        var id = "";
        for (var j = 0; j < newLevel[i].length; j++) {
            if (newLevel[i][j] == 1) {
                leve[j] = leve[j] + 1;
                for (var n = j + 1; n < 7; n++) {
                    leve[n] = 0;
                }
                for (var m = 0; m < leve.length; m++) {
                    if (leve[m] != 0) {
                        if (id == "") id = leve[m];
                        else id += `.${leve[m]}`;
                    }
                }
            }
        }
        endlevel.push(id);
    }
    return endlevel;
};

const exportSLxe = (level, slcum) => {
    var newLevel = [];
    level.map((item) => {
        var ar = [];
        for (var i = 1; i <= 7; i++) {
            if (i == item) ar.push(1);
            else ar.push(0);
        }
        newLevel.push(ar);
    });
    if (newLevel[0][0] == 0) return [];
    var endlevel = [];
    var leve = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < newLevel.length; i++) {
        var id = "";
        for (var j = 0; j < newLevel[i].length; j++) {
            if (newLevel[i][j] == 1) {
                leve[j] = slcum[i];
                for (var n = j + 1; n < 7; n++) {
                    leve[n] = 0;
                }
                for (var m = 0; m < leve.length; m++) {
                    if (leve[m] != 0) {
                        if (id == "") id = `${leve[m]}`;
                        else id *= `${leve[m]}`;
                    }
                }
            }
        }
        endlevel.push(id);
    }
    return endlevel;
};
export default function Modalexport() {
    const {
        bom,
        stateModalexport, setStateModalexport, ulrAPI, dropnoigiacong,setLoading
    } = React.useContext(Context);
    const [dataebom, setDataebom] = React.useState([])
    React.useEffect(() => {
        var url = `${ulrAPI}/api/LoadAllebom`;
        var id = bom.id;
        axios
            .post(url, { id: id })
            .then((res) => {
                if (res.data.length != 0) {
                    setDataebom([]);
                    if (res.data.filter(da => da.length === 0).length === 0) {
                        var dataenovia = res.data[1]
                        var dataebom = res.data[0]
                        var lever = exportLevel(dataenovia.map((en) => en.Level));
                        var Slxe = exportSLxe(
                            dataenovia.map((en) => en.Level),
                            dataenovia.map((en) => en.Amount)
                        );
                        dataenovia.map((item, index) => {
                            var dt = dataebom.filter(da => da.idenovia === item.id2);
                            var ds = dataenovia.filter(da => da.ma_vat_tu === item.ID)
                            setDataebom((dataebom) => [
                                ...dataebom,
                                {
                                    key: index,
                                    no: index + 1,
                                    level: lever[index],
                                    level2: item.Level,
                                    ma_vat_tu: dt.length != 0 ? dt[0].ma_vat_tu : item.ID,
                                    ten_vn: dt.length != 0 ? dt[0].ten_vn : item.Name,
                                    ten_en: dt.length != 0 ? dt[0].ten_en : ds.length != 0 ? ds[0].ten_en : "",
                                    vat_lieu: dt.length != 0 ? dt[0].vat_lieu : ds.length != 0 ? ds[0].vat_lieu : "",
                                    xuat_xu: dt.length != 0 ? dt[0].xuat_xu : ds.length != 0 ? ds[0].xuat_xu : "",
                                    noi_gia_cong: dt.length != 0 ? dt[0].noi_gia_cong : ds.length != 0 ? ds[0].noi_gia_cong : "",
                                    ma_ban_ve: dt.length != 0 ? dt[0].ma_ban_ve : ds.length != 0 ? ds[0].ma_ban_ve : "",
                                    thong_so_ky_thuat: dt.length != 0 ? dt[0].thong_so_ky_thuat : ds.length != 0 ? ds[0].thong_so_ky_thuat : "",
                                    slcum: dt.length != 0 ? dt[0].slcum : item.Amount,
                                    slxe: Slxe[index],
                                    dvt: dt.length != 0 ? dt[0].dvt : ds.length != 0 ? ds[0].dvt : "",
                                    ma_phoi: dt.length != 0 ? dt[0].ma_phoi : ds.length != 0 ? ds[0].ma_phoi : "",
                                    ten_phoi: dt.length != 0 ? dt[0].ten_phoi : ds.length != 0 ? ds[0].ten_phoi : "",
                                    thong_so_phoi: dt.length != 0 ? dt[0].thong_so_phoi : ds.length != 0 ? ds[0].thong_so_phoi : "",
                                    xuat_xu_phoi: dt.length != 0 ? dt[0].xuat_xu_phoi : ds.length != 0 ? ds[0].xuat_xu_phoi : "",
                                    ban_ve_vat_tu: dt.length != 0 ? dt[0].ban_ve_vat_tu : ds.length != 0 ? ds[0].ban_ve_vat_tu : "",
                                    dvt_phoi: dt.length != 0 ? dt[0].dvt_phoi : ds.length != 0 ? ds[0].dvt_phoi : "",
                                    khoi_luong: dt.length != 0 ? dt[0].khoi_luong : ds.length != 0 ? ds[0].khoi_luong : "",
                                    ghi_chu: dt.length != 0 ? dt[0].ghi_chu : ds.length != 0 ? ds[0].ghi_chu : "",
                                },
                            ]);
                        });
                    }
                }
            }).catch((error) => {
                notification["error"]({
                    message: "Thông báo",
                    description: "Không thể truy cập máy chủ",
                    duration: 2
                });
            });
    }, [bom]);
    return (
        <Modal
            title={`TẢI DANH MỤC VẬT TƯ: ${bom && bom.Namebom}`}
            centered
            open={stateModalexport}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalexport(false)}
            footer={false}
            width={1000}
        >
            <div style={{ textAlign: 'center', display: 'block' }}>
                {dropnoigiacong.map((da, index) => (
                    <Button
                        key={index}
                        style={{ width: 150, marginBottom: 10, fontFamily: 'Tahoma' }}
                        type="dashed"
                        onClick={() => {
                            var data = dataebom.filter(de => de.noi_gia_cong === da.label)
                            if(data.length!==0){
                                var url = `${ulrAPI}/api/exportdmvt`;
                            axios
                                .post(url, {
                                    data: data,
                                },
                                    {
                                        responseType: "blob",
                                    }
                                )
                                .then((res) => {
                                    let url = window.URL.createObjectURL(new Blob([res.data]));
                                    let a = document.createElement("a");
                                    a.href = url;
                                    a.download = `DMVT_${bom.Namebom}_${da.label}.xlsx`;
                                    a.click();
                                })
                                .catch((error) => {
                                    notification["error"]({
                                        message: "Thông báo",
                                        description: "Không thể truy cập máy chủ",
                                    });
                                });
                            }
                            else{
                                notification["error"]({
                                    message: "Thông báo",
                                    description: `Không có vật tư của ${da.label}`,
                                    duration: 2
                                });
                            }
                        }}
                        block>{da.label}</Button>
                ))}
            </div>
        </Modal>
    );
}
