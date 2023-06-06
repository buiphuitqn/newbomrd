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


export default function Modalmentions() {
    const {
        stateModalmention,
        setStateModalmention,
        bom,
        setBom,
        ulrAPI,
        listBom,
        setListBom,
    } = React.useContext(Context);
    const [value, setValue] = React.useState(0);
    const [listdept, setListdept] = React.useState([])
    const onChange = (e) => {
        setValue(e.target.value);
    };
    React.useEffect(() => {
        ///api/ds_phong_thuong_hieu

        setValue(bom.ma_phong_ban)
        if (bom) {
            var url = `${ulrAPI}/api/ds_phong_thuong_hieu`;
            var id = bom.IDunit;
            axios
                .post(url, { id: id })
                .then((res) => {
                    setListdept(res.data)
                }).catch((error) => {
                    console.log(error)
                    notification["error"]({
                        message: "Thông báo",
                        description: "Không thể truy cập máy chủ",
                        duration: 2
                    });
                });
        }
    }, [bom]);
    return (
        <Modal
            title={`PHÂN QUYỀN: ${bom.Namebom} - ${bom.namechild}`}
            centered
            open={stateModalmention}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalmention(false)}
            footer={[<Button onClick={() => {
                var url = `${ulrAPI}/api/cai_dat_phong_cum`
                axios
                    .post(url, { id: bom.id, iddept: value })
                    .then((res) => {
                        notification["success"]({
                            message: "Thông báo",
                            description: "Phân quyền thành công",
                            duration: 2
                        });
                        setStateModalmention(false)
                        setBom({ ...bom, ma_phong_ban: value }) 
                        var newlist = [...listBom]
                        let objectToChange = newlist.find(obj => obj.id === bom.idbom)
                            .child.find(childObj => childObj.id === bom.id);
                        if (objectToChange) {
                            objectToChange.ma_phong_ban = value;
                        }
                    }).catch((error) => {
                        console.log(error)
                        notification["error"]({
                            message: "Thông báo",
                            description: "Không thể truy cập máy chủ",
                            duration: 2
                        });
                    });
            }}><SaveOutlined /></Button>]}
        >
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    {
                        listdept.map((da, index) => (
                            <Radio key={index} value={da.id}>{da.ten_phong}</Radio>
                        ))
                    }
                </Space>
            </Radio.Group>
        </Modal>
    );
}
