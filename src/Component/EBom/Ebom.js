import React from "react";
import logo from "../../Library/images/LOGO THACO AUTO.png";
import Context from "../../Data/Context";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
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
  InputNumber,
  notification,
} from "antd";
import Highlighter from "react-highlight-words";
import "./style.css";
import { useNavigate } from "react-router-dom";

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
  const inputNode = <Input />;
  if (children[1] != null && children[1] != undefined && children[1] != "0")
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
    enovia,
    dataSource,
    username,
    dataebom,
    setDataebom,
    datachild,
    setDatachild,
  } = React.useContext(Context);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");
  const [showfinish, setShowfinish] = React.useState(false);
  let navigate = useNavigate();
  React.useEffect(() => {
    var url = "http://113.174.246.52:7978/api/LoadEbomtemp";
    var id = bom.id;
    axios
      .post(url, { id: id })
      .then((res) => {
        if (res.data.length != 0 && res.data.length == enovia.length) {
          setDataebom([]);
          var data = res.data;
          var lever = exportLevel(data.map((en) => en.level));
          var Slxe = exportSLxe(
            data.map((en) => en.level),
            data.map((en) => en.Slxe)
          );
          data.map((item, index) => {
            setDataebom((dataebom) => [
              ...dataebom,
              {
                key: index,
                no: index + 1,
                level: lever[index],
                level2: item.level,
                ID: item.idmaterial,
                Name: item.namematerial,
                vatlieu: item.vatlieu,
                xuatxu: item.xuatxu,
                Quycach: item.Quycach,
                Quycachdotlo: item.Quycachdotlo,
                Tenlinhkien: item.Tenlinhkien,
                Malinhkien: item.Malinhkien,
                slcum: item.Slcum,
                slxe: Slxe[index],
                info2: item.info,
                img: item.image,
                note: item.note,
                Amount: item.amountchange,
                info: item.infochange,
                dvt: item.DVT,
                khuon: item.Khuon,
              },
            ]);
          });
          setShowfinish(true);
        } else {
          if (username[0].level != 1)
            notification["error"]({
              message: "Thông báo",
              description:
                "Chưa nhập dữ liệu tạm cho Ebom. Vui lòng kiểm tra lại",
            });
          var url = "http://113.174.246.52:7978/api/Enovia";
          var id = bom.id;
          axios
            .post(url, { id: id })
            .then((res2) => {
              setDataebom([]);
              if (res2.data.length != 0) {
                var data = res2.data;
                var member = [];
                const list = data.reduce((acc, obj) => {
                  if (member.includes(obj.IDMember) == false)
                    member = [...member, obj.IDMember];
                  return member;
                }, {});
                var lever = exportLevel(
                  softdata(data, list).map((en) => en.level)
                );
                var Slxe = exportSLxe(
                  softdata(data, list).map((en) => en.level),
                  softdata(data, list).map((en) => en.Amount)
                );
                softdata(data, list).map((en, index) => {
                  if (
                    res.data.filter((da) => da.idenovia == en.id).length != 0
                  ) {
                    setDataebom((dataebom) => [
                      ...dataebom,
                      {
                        key: index,
                        no: index + 1,
                        level: lever[index],
                        level2: res.data.filter((da) => da.idenovia == en.id)[0]
                          .level,
                        ID: res.data.filter((da) => da.idenovia == en.id)[0]
                          .idmaterial,
                        Name: res.data.filter((da) => da.idenovia == en.id)[0]
                          .namematerial,
                        vatlieu: res.data.filter(
                          (da) => da.idenovia == en.id
                        )[0].vatlieu,
                        xuatxu: res.data.filter((da) => da.idenovia == en.id)[0]
                          .xuatxu,
                        Quycach: res.data.filter(
                          (da) => da.idenovia == en.id
                        )[0].Quycach,
                        Quycachdotlo: res.data.filter(
                          (da) => da.idenovia == en.id
                        )[0].Quycachdotlo,
                        Tenlinhkien: res.data.filter(
                          (da) => da.idenovia == en.id
                        )[0].Tenlinhkien,
                        Malinhkien: res.data.filter(
                          (da) => da.idenovia == en.id
                        )[0].Malinhkien,
                        slcum: res.data.filter((da) => da.idenovia == en.id)[0]
                          .Slcum,
                        slxe: Slxe[index],
                        info2: res.data.filter((da) => da.idenovia == en.id)[0]
                          .info,
                        img: res.data.filter((da) => da.idenovia == en.id)[0]
                          .image,
                        note: res.data.filter((da) => da.idenovia == en.id)[0]
                          .note,
                        Amount: res.data.filter((da) => da.idenovia == en.id)[0]
                          .amountchange,
                        info: res.data.filter((da) => da.idenovia == en.id)[0]
                          .infochange,
                        dvt: res.data.filter((da) => da.idenovia == en.id)[0]
                          .DVT,
                        khuon: res.data.filter((da) => da.idenovia == en.id)[0]
                          .Khuon,
                      },
                    ]);
                  } else
                    setDataebom((dataebom) => [
                      ...dataebom,
                      {
                        key: index,
                        no: index + 1,
                        level: lever[index],
                        level2: en.level,
                        ID: en.idmaterial,
                        Name:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col0 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col0
                              : "0"
                            : en.Name != ""
                            ? en.Name
                            : "0",
                        vatlieu:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col2 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col2
                              : "0"
                            : "0",
                        xuatxu:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col3 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col3
                              : "0"
                            : "0",
                        Quycach:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col4 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col4
                              : "0"
                            : "0",
                        Quycachdotlo:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col5 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col5
                              : "0"
                            : "0",
                        Tenlinhkien:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col7 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col7
                              : "0"
                            : "0",
                        Malinhkien:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col8 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col8
                              : "0"
                            : "0",
                        slcum: en.Amount,
                        slxe: Slxe[index],
                        info2:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col15 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col15
                              : "0"
                            : "0",
                        img: "0",
                        note: "0",
                        dvt:
                          dataSource.filter((da) => da.col1 == en.idmaterial)
                            .length != 0
                            ? dataSource.filter(
                                (da) => da.col1 == en.idmaterial
                              )[0].col6 != ""
                              ? dataSource.filter(
                                  (da) => da.col1 == en.idmaterial
                                )[0].col6
                              : "0"
                            : "0",
                        info: "0",
                        Amount: "0",
                        khuon: "0",
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
              });
            });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
        });
      });
  }, []);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
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
    var url = "http://113.174.246.52:7978/api/DoneEbom";
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
          });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
        });
      });
  };

  const handleSaveEbom = () => {
    var check = JSON.stringify(dataebom).match(/:null[\},]/) != null;
    if (check) {
      notification["error"]({
        message: "Thông báo",
        description: "Bạn chưa nhập đầy đủ thông tin",
      });
    } else {
      let newArray = [...datachild];
      newArray[
        newArray.indexOf(newArray.filter((da) => da.id == bom.id)[0])
      ].status = 1;
      setDatachild(newArray);
      var url = "http://113.174.246.52:7978/api/Insertebomtemp";
      var id = bom.id;
      var data = dataebom;
      axios
        .post(url, {
          id: id,
          data: data,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          notification["error"]({
            message: "Thông báo",
            description: "Không thể truy cập máy chủ",
          });
        });
      notification["success"]({
        message: "Thông báo",
        description: "Dữ liệu đã được lưu vào bảng tạm",
      });
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
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
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "id",
    },
    {
      title: "Phân cấp",
      dataIndex: "level",
      key: "id",
      ...getColumnSearchProps("level"),
    },
    {
      title: "Tình trạng sửa đổi",
      children: [
        {
          title: "Số lượng",
          dataIndex: "Amount",
          key: "member",
          editable: true,
        },
        {
          title: "Thông tin kỹ thuật",
          dataIndex: "info",
          key: "member",
          editable: true,
        },
      ],
    },
    {
      title: "Tên hàng hóa",
      dataIndex: "Name",
      key: "member",
      editable: true,
      ...getColumnSearchProps("Name"),
    },
    {
      title: "Mã hàng hóa",
      dataIndex: "ID",
      key: "name",
      ...getColumnSearchProps("ID"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      editable: true,
    },
    {
      title: "Vật liệu",
      dataIndex: "vatlieu",
      key: "vatlieu",
      editable: true,
    },
    {
      title: "Xuất xứ",
      dataIndex: "xuatxu",
      key: "xuatxu",
      editable: true,
      ...getColumnSearchProps("xuatxu"),
    },
    {
      title: "Thông số kỹ thuật",
      dataIndex: "info2",
      key: "info2",
      editable: true,
    },
    {
      title: "Quy cách",
      dataIndex: "Quycach",
      key: "Quycach",
      editable: true,
    },
    {
      title: "Quy cách đột lỗ",
      dataIndex: "Quycachdotlo",
      key: "Quycachdotlo",
      editable: true,
    },
    {
      title: "ĐVT",
      dataIndex: "dvt",
      key: "dvt",
      editable: true,
      ...getColumnSearchProps("dvt"),
    },
    {
      title: "SL/Cụm",
      dataIndex: "slcum",
    },
    {
      title: "SL/Xe",
      dataIndex: "slxe",
      key: "sl2",
    },
    {
      title: "Tên linh kiện",
      dataIndex: "Tenlinhkien",
      key: "Telinhkien",
      editable: true,
    },
    {
      title: "Mã linh kiện",
      dataIndex: "Malinhkien",
      key: "Malinhkien",
      editable: true,
      ...getColumnSearchProps("Malinhkien"),
    },
    {
      title: "Yêu cầu khuôn",
      dataIndex: "khuon",
      editable: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      editable: true,
    },
    {
      title: "Chức năng",
      key: "edit",
      render: (_, record) => {
        const editable = isEditing(record);
        if (bom.status < 2) {
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
          );
        } else {
          if (username.filter((da) => da.idunit == bom.IDunit)[0].level > 6)
            return editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                Edit
              </Typography.Link>
            );
        }
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
              E-BOM {bom.indexchild && ` (${bom.namechild})`}
            </Button>
          </Divider>
        </Col>
        <Col span={6}>
          <Divider orientation="right">
            {username.filter((da) => da.idunit == bom.IDunit)[0].level == 2 ? (
              showfinish && (
                <Button onClick={handleExportMBom} type="primary">
                  Xác nhận Ebom
                </Button>
              )
            ) : (
              <Button onClick={handleSaveEbom} type="primary">
                Lưu E-BOM
              </Button>
            )}
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
            <p>{`Số: ${bom.NoBom}`}</p>
            <p>{`Ngày: ${new Date(bom.TimeCreate).getDate()}/${
              new Date(bom.TimeCreate).getMonth() + 1
            }/${new Date(bom.TimeCreate).getFullYear()}`}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form form={form} component={false}>
            <Table
              className="tbebom"
              style={{
                fontFamily: "Tahoma",
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
