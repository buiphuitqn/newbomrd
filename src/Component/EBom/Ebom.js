//Bảng nhập BOM

import React from "react";
import logo from "../../Library/images/LOGO THACO AUTO.png";
import Context from "../../Data/Context";
import axios from "axios";
import { CloseOutlined, EditOutlined, SaveOutlined, SearchOutlined, ClockCircleOutlined, QuestionCircleOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import {
  Divider,
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  Row,
  Col,
  Form,
  Typography,
  Tag,
  Select,
  notification,
} from "antd";
import Highlighter from "react-highlight-words";
import "./style.css";
import { useNavigate } from "react-router-dom";


const exportLevel = (level) => {
  var newLevel = [];
  level.map((item) => {
    var ar = [];
    for (var i = 2; i <= 7; i++) {
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
    for (var i = 2; i <= 7; i++) {
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
const softdata = (arrayall, arraymember) => {
  var newarray = [];
  return arraymember.reduce((acc, obj) => {
    newarray = [...newarray, ...arrayall.filter((ar) => ar.IDMember == obj)];
    return newarray;
  }, {});
};
export default function Ebomexport() {
  const {
    bom,
    setBom,
    dataSource,
    username,
    dataebom,
    setDataebom,
    datachild,
    setDatachild,
    dropdvt,
    dropnoigiacong,
    dropxuatxu,
    ulrAPI
  } = React.useContext(Context);
  const [searchText, setSearchText] = React.useState("");
  const [editText, setEditText] = React.useState({});
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");
  const [showfinish, setShowfinish] = React.useState(false);
  const [editingrow, setEditingrow] = React.useState(false);
  const inputRef = React.useRef([]);
  let navigate = useNavigate();

  //hàm tạo dòng edit dữ liệu
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    var inputNode = <Input />;
    if (dataIndex == 'xuat_xu') {
      inputNode = (
        <Select options={dropxuatxu} onChange={(value) => record.xuat_xu = value} />
      );
    }
    if (dataIndex == 'noi_gia_cong') {
      inputNode = (
        <Select options={dropnoigiacong} onChange={(value) => record.noi_gia_cong = value} />
      );
    }
    if (dataIndex == 'dvt') {
      inputNode = (
        <Select options={dropdvt} onChange={(value) => record.dvt = value} />
      );
    }
    if (dataIndex == 'xuat_xu_phoi') {
      inputNode = (
        <Select options={dropxuatxu} onChange={(value) => record.xuat_xu_phoi = value} />
      );
    }
    if (dataIndex == 'dvt_phoi') {
      inputNode = (
        <Select options={dropdvt} onChange={(value) => record.dvt_phoi = value} />
      );
    }
    const arraydrop = ['xuat_xu', 'noi_gia_cong', 'dvt', 'xuat_xu_phoi', 'dvt_phoi']
    if (arraydrop.filter(da => da == dataIndex).length == 0)
      if (children[1] != null && children[1] != undefined && children[1] != "-" && children[1] != "0")
        editing = false;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  React.useEffect(() => {
    //Tải dữ liệu từ bảng ebom
    var url = `${ulrAPI}/api/LoadEbomtemp`;
    var id = bom.id;
    axios
      .post(url, { id: id })
      .then((res) => {
        if (res.data.length != 0) {
          setDataebom([]);
          var data = res.data;
          var lever = exportLevel(data.map((en) => en.level));
          var Slxe = exportSLxe(
            data.map((en) => en.level),
            data.map((en) => en.slcum)
          );
          data.map((item, index) => {
            setDataebom((dataebom) => [
              ...dataebom,
              {
                key: index,
                no: index + 1,
                level: lever[index],
                level2: item.level,
                ma_vat_tu: item.ma_vat_tu,
                ten_vn: item.ten_vn,
                ten_en: item.ten_en,
                vat_lieu: item.vat_lieu,
                xuat_xu: item.xuat_xu,
                noi_gia_cong: item.noi_gia_cong,
                ma_ban_ve: item.ma_ban_ve,
                thong_so_ky_thuat: item.thong_so_ky_thuat,
                slcum: item.slcum,
                slxe: Slxe[index],
                dvt: item.dvt,
                ma_phoi: item.ma_phoi,
                ten_phoi: item.ten_phoi,
                thong_so_phoi: item.thong_so_phoi,
                xuat_xu_phoi: item.xuat_xu_phoi,
                ban_ve_vat_tu: item.ban_ve_vat_tu,
                dvt_phoi: item.dvt_phoi,
                khoi_luong: item.khoi_luong,
                ghi_chu: item.ghi_chu,
                idenovia: item.idenovia
              },
            ]);
          });
          setShowfinish(true);
        } else {
          var url = `${ulrAPI}/api/Enoviachild`;
          var id = bom.id;
          axios
            .post(url, { id: id })
            .then((res2) => {
              console.log(res2)
              setDataebom([]);
              if (res2.data.length != 0) {
                var data = res2.data;
                var lever = exportLevel(
                  data.map((en) => en.level)
                );
                var Slxe = exportSLxe(
                  data.map((en) => en.level),
                  data.map((en) => en.Amount)
                );
                data.map((en, index) => {
                  setDataebom((dataebom) => [
                    ...dataebom,
                    {
                      key: index,
                      no: index + 1,
                      level: lever[index],
                      level2: en.level,
                      ma_vat_tu: en.idmaterial,
                      ten_vn:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ten_vn != ""
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ten_vn
                            : "-"
                          : en.Name != ""
                            ? en.Name
                            : "-",
                      ten_en:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ten_en != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ten_en != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ten_en
                            : "-"
                          : "-",
                      vat_lieu:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].vat_lieu != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].vat_lieu != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].vat_lieu
                            : "-"
                          : "-",
                      xuat_xu:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].xuat_xu != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].xuat_xu != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].xuat_xu
                            : "-"
                          : "-",
                      noi_gia_cong:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].noi_gia_cong != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].noi_gia_cong != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].noi_gia_cong
                            : "-"
                          : "-",
                      ma_ban_ve:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ma_ban_ve != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ma_ban_ve != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ma_ban_ve
                            : "-"
                          : "-",
                      thong_so_ky_thuat:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].thong_so_ky_thuat != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].thong_so_ky_thuat != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].thong_so_ky_thuat
                            : "-"
                          : "-",
                      dvt:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].dvt != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].dvt != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].dvt
                            : "-"
                          : "-",
                      ma_phoi:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ma_phoi != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ma_phoi != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ma_phoi
                            : "-"
                          : "-",
                      slcum: en.Amount,
                      slxe: Slxe[index],
                      ten_phoi:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ten_phoi != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ten_phoi != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ten_phoi
                            : "-"
                          : "-",
                      xuat_xu_phoi:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].xuat_xu_phoi != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].xuat_xu_phoi != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].xuat_xu_phoi
                            : "-"
                          : "-",
                      thong_so_phoi:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].thong_so_phoi != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].thong_so_phoi != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].thong_so_phoi
                            : "-"
                          : "-",
                      ban_ve_vat_tu:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ban_ve_vat_tu != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ban_ve_vat_tu != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ban_ve_vat_tu
                            : "-"
                          : "-",
                      dvt_phoi:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].dvt_phoi != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].dvt_phoi != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].dvt_phoi
                            : "-"
                          : "-",
                      khoi_luong:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].khoi_luong != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].khoi_luong != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].khoi_luong
                            : "-"
                          : "-",
                      ghi_chu:
                        dataSource.filter((da) => da.ma_vat_tu == en.idmaterial)
                          .length != 0
                          ? (dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ghi_chu != '' && dataSource.filter(
                            (da) => da.ma_vat_tu == en.idmaterial
                          )[0].ghi_chu != null)
                            ? dataSource.filter(
                              (da) => da.ma_vat_tu == en.idmaterial
                            )[0].ghi_chu
                            : "-"
                          : "-",
                      idenovia: en.id,
                    },
                  ]);
                });
              }
            })
            .catch((error) => {
              console.log(error);
              notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration: 2
              });
            });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      });
  }, []);

  const listtext = {}

  const handleInputkeyDown = (e, key, dataIndex, ind) => {
    if (e.keyCode == 13) {
      const updatedData = [...dataebom];
      const index = updatedData.findIndex((item) => item.key === key);
      updatedData[index][dataIndex] = listtext[`${dataIndex}${ind}`];
      setDataebom(updatedData);
    }
  };

  const handleonChangeselect = (value, key, dataIndex, ind) => {
    const updatedData = [...dataebom];
      const index = updatedData.findIndex((item) => item.key === key);
      updatedData[index][dataIndex] = value;
      setDataebom(updatedData);
  };

  const handleFocus = (record, dataIndex, ind) => {
    if (!listtext.hasOwnProperty(`${dataIndex}${ind}`)) {
      listtext[`${dataIndex}${ind}`] = record[`${dataIndex}`]
    }
  }

  const handleOnchange = (e, dataIndex, ind) => {
    console.log(listtext)
    listtext[`${dataIndex}${ind}`] = e.target.value
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Nhập nội dung`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xoá
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleExportMBom = () => {
    var url = `${ulrAPI}/api/DoneEbom`;
    var id = bom.id;
    axios
      .post(url, { id: id })
      .then((res) => {
        if (res.data.length != 0) {
          let newArray = [...datachild];
          newArray[
            newArray.indexOf(newArray.filter((da) => da.id == bom.id)[0])
          ].status = 2;
          setDatachild(newArray);
          notification["success"]({
            message: "Thông báo",
            description: "Lưu thành công",
            duration: 2
          });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      });
  };

  const handleSendApprove = () => {
    var url = `${ulrAPI}/api/updatestatusbomchild`
    var id = bom.id
    var status = 1
    axios.post(url, { id: id, status: 1 })
      .then((res) => {
        if (res.data === 'OK') {
          setBom({
            ...bom, status: 1, statuschild: <Tag icon={<ClockCircleOutlined />} color="warning">
              Đang phê duyệt
            </Tag>
          })
          notification["success"]({
            message: 'Thông báo',
            description: "Gửi phê duyệt thành công",
            duration: 2
          })
        }
      }).catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      })
  }
  const handleSaveEbom = () => {
    //var check = JSON.stringify(dataebom).match(/:null[\},]/) != null;
    var url = `${ulrAPI}/api/Insertebomtemp`;
    var id = bom.id;
    var data = dataebom;
    axios
      .post(url, {
        id: id,
        data: data,
      })
      .then((res) => {
        if (res.data.affectedRows === dataebom.length)
          notification["success"]({
            message: "Thông báo",
            description: "Dữ liệu đã được lưu",
            duration: 2
          });
        else {
          notification["warning"]({
            message: "Thông báo",
            description: "Có lỗi trong quá trình lưu. Vui lòng thử lại",
            duration: 2
          });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      });
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      var arr = ['BUS THACO', 'TẢI THACO', 'THACO ROYAL', 'LUXURY CAR']
      if (arr.includes(row.noi_gia_cong) && row.dvt !== 'Bộ') {
        if (row.ma_phoi === '0') {
          notification["error"]({
            message: "Thông báo",
            description: "Không để trống thông tin phôi",
            duration: 2
          });
        }
        else {
          const newData = [...dataebom];
          const index = newData.findIndex((item) => key === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setDataebom(newData);
            setEditingKey("");
          } else {
            newData.push(row);
            setDataebom(newData);
            setEditingKey("");
          }
        }
      }
      else {
        const newData = [...dataebom];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setDataebom(newData);
          setEditingKey("");
        } else {
          newData.push(row);
          setDataebom(newData);
          setEditingKey("");
        }
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "id",
      width: '80px',
      fixed: 'left',
    },
    {
      title: "Phân cấp",
      dataIndex: "level",
      width: '150px',
      key: "id",
      fixed: 'left',
      ...getColumnSearchProps("level"),
    }, {
      title: 'Thông tin linh kiện',
      children: [{
        title: "Mã hàng hóa",
        dataIndex: "ma_vat_tu",
        key: "mahang",
        width: '150px',
        ...getColumnSearchProps("ma_vat_tu"),
      }, {
        title: "Tên hàng hoá",
        children: [{
          title: "Tên hàng hóa (VN)",
          dataIndex: "ten_vn",
          width: '150px',
          key: "ten_vn",
          editable: true,
          ...getColumnSearchProps("ten_vn"),
        },
        {
          title: "Tên hàng hóa (EN)",
          dataIndex: 'ten_en',
          key: "member",
          width: '150px',
          editable: true,
          render: (_, record, index) => (editingrow&&(record.ten_en==='0'||record.ten_en==='-'||record.ten_en==='') ?
            <Input
              defaultValue={record.ten_en} onFocus={() => handleFocus(record, 'ten_en', index)} onChange={(e) => handleOnchange(e, 'ten_en', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ten_en', index)} /> :
            record.ten_en
          ),
        }]
      },
      {
        title: "Vật liệu",
        dataIndex: "vat_lieu",
        key: "vat_lieu",
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&(record.vat_lieu==='0'||record.vat_lieu==='-'||record.vat_lieu==='') ?
          <Input
            defaultValue={record.vat_lieu} onFocus={() => handleFocus(record, 'vat_lieu', index)} onChange={(e) => handleOnchange(e, 'vat_lieu', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'vat_lieu', index)} /> :
          record.vat_lieu
        ),
      },
      {
        title: "Xuất xứ",
        dataIndex: "xuat_xu",
        key: "xuat_xu",
        width: '150px',
        editable: true,
        ...getColumnSearchProps("xuat_xu"),
        render: (_, record, index) => (editingrow&&(record.xuat_xu==='0'||record.xuat_xu===''||record.xuat_xu==='-') ?
        <Select options={dropxuatxu} onChange={(value) =>handleonChangeselect(value, record.key, 'xuat_xu', index)}/>:
          record.xuat_xu
        ),
      },
      {
        title: "Nơi gia công thành phẩm",
        dataIndex: "noi_gia_cong",
        key: "noi_gia_cong",
        width: '150px',
        editable: true,
        ...getColumnSearchProps("noi_gia_cong"),
        render: (_, record, index) => (editingrow&&(record.noi_gia_cong==='0'||record.noi_gia_cong==='-'||record.noi_gia_cong==='') ?
        <Select options={dropnoigiacong} onChange={(value) =>handleonChangeselect(value, record.key, 'noi_gia_cong', index)}/>:
          record.noi_gia_cong
        ),
      }, {
        title: 'Thông tin kỹ thuật',
        children: [{
          title: 'Bản vẽ',
          dataIndex: 'ma_ban_ve',
          width: '100px',
          ...getColumnSearchProps("ma_ban_ve"),
          render: (_, record, index) => (editingrow&&(record.ma_ban_ve==='0'||record.ma_ban_ve==='-'||record.ma_ban_ve==='') ?
            <Input
              defaultValue={record.ma_ban_ve} onFocus={() => handleFocus(record, 'ma_ban_ve', index)} onChange={(e) => handleOnchange(e, 'ma_ban_ve', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ma_ban_ve', index)} /> :
            record.ma_ban_ve
          ),
        },
        {
          title: "Thông số kỹ thuật",
          dataIndex: "thong_so_ky_thuat",
          key: "thong_so_ky_thuat",
          width: '100px',
          editable: true,
          ...getColumnSearchProps("thong_so_ky_thuat"),
          render: (_, record, index) => (editingrow&&(record.thong_so_ky_thuat==='0'||record.thong_so_ky_thuat==='-'||record.thong_so_ky_thuat==='') ?
            <Input
              defaultValue={record.thong_so_ky_thuat} onFocus={() => handleFocus(record, 'thong_so_ky_thuat', index)} onChange={(e) => handleOnchange(e, 'thong_so_ky_thuat', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'thong_so_ky_thuat', index)} /> :
            record.thong_so_ky_thuat
          ),
        }]
      },
      {
        title: "ĐVT",
        dataIndex: "dvt",
        width: '100px',
        key: "dvt",
        editable: true,
        ...getColumnSearchProps("dvt"),
        render: (_, record, index) => (editingrow&&(record.dvt==='0'||record.dvt==='-'||record.dvt==='') ?
        <Select options={dropdvt} onChange={(value) =>handleonChangeselect(value, record.key, 'dvt', index)}/>:
          record.dvt
        ),
      },
      {
        title: "SL/Cụm",
        dataIndex: "slcum",
        width: '80px',
      },
      {
        title: "SL/Xe",
        dataIndex: "slxe",
        key: "sl2",
        width: '80px',
      }]
    }, {
      title: 'Thông tin phôi',
      children: [{
        title: "Mã số phôi",
        dataIndex: "ma_phoi",
        key: "ma_phoi",
        width: '100px',
        editable: true,
        ...getColumnSearchProps("ma_phoi"),
        render: (_, record, index) => (editingrow&&(record.ma_phoi==='0'||record.ma_phoi==='-'||record.ma_phoi==='') ?
          <Input
            defaultValue={record.ma_phoi} onFocus={() => handleFocus(record, 'ma_phoi', index)} onChange={(e) => handleOnchange(e, 'ten_en', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ma_phoi', index)} /> :
          record.ma_phoi
        ),
      },
      {
        title: <div><p>Tên phôi</p><p>(Chọn gia công)</p></div>,
        dataIndex: "ten_phoi",
        key: "ten_phoi",
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&(record.ten_phoi==='0'||record.ten_phoi==='-'||record.ten_phoi==='') ?
          <Input
            defaultValue={record.ten_phoi} onFocus={() => handleFocus(record, 'ten_phoi', index)} onChange={(e) => handleOnchange(e, 'ten_phoi', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ten_phoi', index)} /> :
          record.ten_phoi
        ),
      }, {
        title: 'Thông số kỹ thuật',
        dataIndex: 'thong_so_phoi',
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&(record.thong_so_phoi==='0'||record.thong_so_phoi==='-'||record.thong_so_phoi==='') ?
          <Input
            defaultValue={record.thong_so_phoi} onFocus={() => handleFocus(record, 'thong_so_phoi', index)} onChange={(e) => handleOnchange(e, 'thong_so_phoi', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'thong_so_phoi', index)} /> :
          record.thong_so_phoi
        ),
      }, {
        title: 'Xuất xứ phôi',
        dataIndex: 'xuat_xu_phoi',
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&record.xuat_xu_phoi==='0' ?
        <Select options={dropxuatxu} onChange={(value) =>handleonChangeselect(value, record.key, 'xuat_xu_phoi', index)}/>:
          record.xuat_xu_phoi
        ),
      }, {
        title: 'Mã số bản vẽ phôi',
        dataIndex: 'ban_ve_vat_tu',
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&(record.ban_ve_vat_tu==='0'||record.ban_ve_vat_tu==='-'||record.ban_ve_vat_tu==='') ?
          <Input
            defaultValue={record.ban_ve_vat_tu} onFocus={() => handleFocus(record, 'ban_ve_vat_tu', index)} onChange={(e) => handleOnchange(e, 'ban_ve_vat_tu', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ban_ve_vat_tu', index)} /> :
          record.ban_ve_vat_tu
        ),
      }, {
        title: 'ĐVT',
        dataIndex: 'dvt_phoi',
        width: '100px',
        editable: true,
        ...getColumnSearchProps("dvt_phoi"),
        render: (_, record, index) => (editingrow&&(record.dvt_phoi==='0'||record.dvt_phoi==='-'||record.dvt_phoi==='') ?
        <Select options={dropdvt} onChange={(value) =>handleonChangeselect(value, record.key, 'dvt_phoi', index)}/>:
          record.dvt_phoi
        ),
      }, {
        title: 'Khôi lượng phôi/xe',
        dataIndex: 'khoi_luong',
        width: '100px',
        editable: true,
        render: (_, record, index) => (editingrow&&record.khoi_luong==='0' ?
          <Input
            defaultValue={record.khoi_luong} onFocus={() => handleFocus(record, 'khoi_luong', index)} onChange={(e) => handleOnchange(e, 'khoi_luong', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'khoi_luong', index)} /> :
          record.khoi_luong
        ),
      }]
    }, {
      title: 'Ghi chú',
      dataIndex: 'ghi_chu',
      width: '100px',
      editable: true,
      render: (_, record, index) => (editingrow&&record.ghi_chu==='0' ?
        <Input
          defaultValue={record.ghi_chu} onFocus={() => handleFocus(record, 'ghi_chu', index)} onChange={(e) => handleOnchange(e, 'ghi_chu', index)} onKeyDown={(e) => handleInputkeyDown(e, record.key, 'ghi_chu', index)} /> :
        record.ghi_chu
      ),
    },
    {
      title: "Chức năng",
      key: "edit",
      width: '100px',
      fixed: !editingrow?'right':'none',
      render: (_, record) => {
        const editable = isEditing(record);
        if(!editingrow) return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              <SaveOutlined />
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
        );
        // } else {
        //   if (username.filter((da) => da.idunit == bom.IDunit)[0].level > 6)
        //     return editable ? (
        //       <span>
        //         <Typography.Link
        //           onClick={() => save(record.key)}
        //           style={{
        //             marginRight: 8,
        //           }}
        //         >
        //           Save
        //         </Typography.Link>
        //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
        //           <a>Cancel</a>
        //         </Popconfirm>
        //       </span>
        //     ) : (
        //       <Typography.Link
        //         disabled={editingKey !== ""}
        //         onClick={() => edit(record)}
        //       >
        //         Edit
        //       </Typography.Link>
        //     );
        // }
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      if (!col.children) return col;
      else {
        col.children.map((chil, index) => {
          if (chil.editable) {
            col.children[index] = {
              ...chil,
              onCell: (record) => ({
                record,
                dataIndex: chil.dataIndex,
                title: chil.title,
                editing: isEditing(record),
              }),
            };
            return col;
          }
          else {
            if (!chil.children) return col
            else {
              chil.children.map((chi, index2) => {
                if (chi.editable) {
                  col.children[index].children[index2] = {
                    ...chi,
                    onCell: (record) => ({
                      record,
                      dataIndex: chi.dataIndex,
                      title: chi.title,
                      editing: isEditing(record),
                    }),
                  };
                  return col;
                }
              })
            }
          }
        });
      }
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div
      style={{
        width: "-webkit-fill-available",
      }}
    >
      <Row>
        <Col span={18}>
          <Divider orientation="left">
            <Button
              type="link"
              style={{
                fontFamily: "Tahoma",
                fontSize: 18,
                color: "black",
                fontWeight: "bold",
              }}
            >
              E-BOM {bom.name && ` (${bom.name})`}
            </Button>
          </Divider>
        </Col>
        <Col span={6}>
          <Divider orientation="right">
            {/* {username.filter((da) => da.idunit == bom.IDunit)[0].level == 2 ? (
              showfinish && (
                <Button onClick={handleExportMBom} type="primary">
                  Xác nhận Ebom
                </Button>
              )
            ) : (
              <Button onClick={handleSaveEbom} type="primary">
                Lưu E-BOM
              </Button>
            )} */}
            {(bom.status === 0 || bom.status === 2) ? (
              <div>
                {editingrow ? (
                  <Button type="primary" onClick={() => setEditingrow(false)}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => setEditingrow(true)}>Edit</Button>
                )}
                <Popconfirm
                  title="Bạn có muốn lưu"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={handleSaveEbom}
                >
                  <Button type="primary">
                    Lưu E-BOM
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có muốn gửi duyệt"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={handleSendApprove}
                >
                  <Button type="danger">
                    Gửi phê duyệt
                  </Button></Popconfirm></div>) : bom.statuschild}
          </Divider>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="ebomtitle">
          <img src={logo} className="imgnav"></img>
        </Col>
        <Col span={12} className="ebomtitle align-items-center text-center">
          <div style={{ width: "100%" }}>
            <h5>DANH MỤC VẬT TƯ THIẾT KẾ</h5>
            <h5>{bom.Namebom}</h5>
          </div>
        </Col>
        <Col span={6} className="ebomtitle">
          <div style={{ width: "100%" }}>
            <p>Mã hóa: QT.RDOT.TTTK/01- BM07</p>
            <p>Đơn vị: R&D Ô tô</p>
            <p>{`Số: ${bom.nobom}`}</p>
            <p>{`Ngày: ${new Date(bom.TimeCreate).getDate()}/${new Date(bom.TimeCreate).getMonth() + 1
              }/${new Date(bom.TimeCreate).getFullYear()}`}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form form={form} component={false}>
            <Table
              className="tbebomchild2"
              style={{
                fontFamily: "Tahoma",
                fontSize: 14
              }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{
                x: 2000,
                y: 5000,
              }}
              pagination={{
                defaultPageSize: 50,
              }}
              columns={mergedColumns}
              rowClassName={(record, index) =>
                record.xuatxu == "BUS THACO" &&
                  record.dvt == "Chi tiết" &&
                  record.Malinhkien == "0"
                  ? "red"
                  : "green"
              }
              bordered
              dataSource={dataebom}
            />
          </Form>
        </Col>
      </Row>
    </div>
  );
}
