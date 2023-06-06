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


export default function Modaladdgroup() {
    const {
        stateModaladdgroupb,
        setStateModaladdgroupb,
        ulrAPI,
        setDatatable,
        deptselect
    } = React.useContext(Context);
    const [value, setValue] = React.useState('');
    React.useEffect(() => {
    }, []);
    return (
        <Modal
            title={`Tạo nhóm`}
            centered
            open={stateModaladdgroupb}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModaladdgroupb(false)}
            footer={[<Button onClick={()=>{
                var url = `${ulrAPI}/api/tao_nhom`
                axios
                .post(url, { dept:deptselect,name:value })
                .then((res) => {
                    if(res.data==='NG')
                    notification["error"]({
                        message: "Thông báo",
                        description: "Tạo thất bại",
                        duration: 2
                    });
                    else{
                        setStateModaladdgroupb(false)
                        setDatatable(datatable=>[...datatable,{
                            key:datatable.length,
                            id:res.data.insertId,
                            ten_nhom:value,
                            no:datatable.length+1
                        }])
                        setValue('')
                    }
                    
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
            <Input placeholder="Nhập tên nhóm" value={value} onChange={(e)=>{
                setValue(e.target.value)
            }}/>
        </Modal>
    );
}
