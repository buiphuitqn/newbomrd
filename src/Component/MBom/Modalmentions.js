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
        ulrAPI
    } = React.useContext(Context);
    const [value, setValue] = React.useState(0);
    const [listdept,setListdept] = React.useState([])
    const onChange = (e) => {
        setValue(e.target.value);
    };
    React.useEffect(() => {
        ///api/ds_phong_thuong_hieu
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
            footer={[<Button onClick={()=>{
                var url = `${ulrAPI}/api/cai_dat_phong_cum`
                axios
                .post(url, { id: bom.id,iddept:value })
                .then((res) => {
                    notification["success"]({
                        message: "Thông báo",
                        description: "Phân quyền thành công",
                        duration: 2
                    });
                    setStateModalmention(false)
                }).catch((error) => {
                    console.log(error)
                    notification["error"]({
                        message: "Thông báo",
                        description: "Không thể truy cập máy chủ",
                        duration: 2
                    });
                });
            }}><SaveOutlined/></Button>]}
        >
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    {
                        listdept.map((da,index)=>(
                            <Radio key={index} value={da.id}>{da.ten_phong}</Radio>
                        ))
                    }
                </Space>
            </Radio.Group>
        </Modal>
    );
}
