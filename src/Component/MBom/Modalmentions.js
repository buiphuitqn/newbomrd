import React from "react";
import {
    Form,
    Col,
    Modal,
    Row,
    Input,
    Button,
    Mentions,
    notification,
    Select,
} from "antd";
import Context from "../../Data/Context";
import axios from "axios";
import "./style.css";


export default function Modalmentions() {
    const {
        stateModalmention,
        setStateModalmention,
        bom
    } = React.useContext(Context);
    React.useEffect(() => {
        
    }, []);

    console.log(bom)
    return (
        <Modal
            title={`PHÂN QUYỀN: ${bom.Namebom} - ${bom.namechild}`}
            centered
            open={stateModalmention}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalmention(false)}
            footer={[<p>Vui lòng điền đầy đủ thông tin</p>]}
        >
            <Mentions
                style={{
                    width: '100%',
                }}
                options={[
                    {
                        value: 'Bùi Ngọc Phú',
                        label: 'Bùi Ngọc Phú',
                    },
                    {
                        value: 'Trần Lê Quốc Bảo',
                        label: 'Trần Lê Quốc Bảo',
                    },
                    {
                        value: 'Hồ Quốc Thăng',
                        label: 'Hồ Quốc Thăng',
                    },
                ]}
            />
        </Modal>
    );
}
