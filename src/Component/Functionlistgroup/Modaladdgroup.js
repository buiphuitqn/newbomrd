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
        stateModaladdgroup,
        setStateModaladdgroup,
        ulrAPI,
        listgroup,setListgroup
    } = React.useContext(Context);
    const [value, setValue] = React.useState('');
    React.useEffect(() => {
    }, []);
    return (
        <Modal
            title={`Tạo vai trò`}
            centered
            open={stateModaladdgroup}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModaladdgroup(false)}
            footer={[<Button onClick={()=>{
                var url = `${ulrAPI}/api/them_vai_tro`
                axios
                .post(url, { name:value })
                .then((res) => {
                    if(res.data==='NG')
                    notification["error"]({
                        message: "Thông báo",
                        description: "Tạo thất bại",
                        duration: 2
                    });
                    else{
                        setStateModaladdgroup(false)
                        setListgroup(listgroup=>[...listgroup,{
                            key:listgroup.length,
                            id:res.data.insertId,
                            ten_group:value,
                            no:listgroup.length+1
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
            <Input placeholder="Nhập tên vai trò" value={value} onChange={(e)=>{
                setValue(e.target.value)
            }}/>
        </Modal>
    );
}
