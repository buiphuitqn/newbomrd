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


export default function Modalgroup() {
    const {
        stateModalgroup,
        setStateModalgroup,
        bomchild,
        ulrAPI,
        listBom
    } = React.useContext(Context);
    const [value, setValue] = React.useState(0);
    const [listdept,setListdept] = React.useState([])
    const onChange = (e) => {
        setValue(e.target.value);
    };
    React.useEffect(() => {
        setValue(bomchild.ma_nhom)
        if (bomchild) {
            var url = `${ulrAPI}/api/ds_nhom_phong`;
            var id = bomchild.ma_phong_ban;
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
    }, [bomchild]);
    return (
        <Modal
            title={`PHÂN QUYỀN: ${bomchild.Namebom} - ${bomchild.namechild} - ${bomchild.name}`}
            centered
            open={stateModalgroup}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalgroup(false)}
            footer={[<Button onClick={()=>{
                var url = `${ulrAPI}/api/cai_dat_nhom_con`
                axios
                .post(url, { id: bomchild.id,iddept:value })
                .then((res) => {
                    notification["success"]({
                        message: "Thông báo",
                        description: "Phân quyền thành công",
                        duration: 2
                    });
                    
                    var newlist = [...listBom]
                        let objectToChange = newlist.find(obj => obj.nobom === bomchild.nobom && obj.Namebom === bomchild.Namebom)
                            .child.find(childObj => childObj.id === bomchild.idbom).child.find(childObj2 => childObj2.id === bomchild.id);
                        if (objectToChange) {
                            objectToChange.ma_nhom = value;
                        }
                    setStateModalgroup(false)

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
                            <Radio key={index} value={da.id}>{da.ten_nhom}</Radio>
                        ))
                    }
                </Space>
            </Radio.Group>
        </Modal>
    );
}
