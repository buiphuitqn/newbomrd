import React, { Fragment } from "react";
import logo from "../../Library/images/LOGO THACO AUTO.png";
import Context from "../../Data/Context";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { downloadExcel } from "react-export-table-to-excel";
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

export default function MBom() {
  const {
    parentbom,
    setParentbom,
    bom,
    dataSource,
    username,
    dataebom,
    datachild,
    setDatachild,
  } = React.useContext(Context);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const [datambom, setDatambom] = React.useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");
  const [showfinish, setShowfinish] = React.useState(false);
  let navigate = useNavigate();
  React.useEffect(() => {
    var url = "";
    parentbom.indexchild
      ? (url = "http://113.174.246.52:7978/api/LoadMbomtemp")
      : (url = "http://113.174.246.52:7978/api/LoadAllMbom");
    var id = parentbom.id;
    axios
      .post(url, { id: parentbom.id })
      .then((res) => {
        if (res.data.length != 0) {
          setShowfinish(true);
          setDatambom([]);
          var data = res.data;
          var member = [];
          const list = data.reduce((acc, obj) => {
            if (member.includes(obj.IDMember) == false)
              member = [...member, obj.IDMember];
            return member;
          }, {});
          var lever = exportLevel(softdata(data, list).map((en) => en.level));
          var Slxe = exportSLxe(
            softdata(data, list).map((en) => en.level),
            softdata(data, list).map((en) => en.Slcum)
          );
          softdata(data, list).map((item, index) => {
            setDatambom((datambom) => [
              ...datambom,
              {
                key: index,
                no: index + 1,
                level: lever[index],
                level2: item.level,
                Name: item.namematerial,
                ID: item.idmaterial,
                info2: item.info,
                vatlieu: item.vatlieu,
                xuatxu: item.xuatxu,
                slcum: item.Slcum,
                slxe: Slxe[index],

                note: item.note,
                tieuhao:
                  dataSource.filter((da) => da.col1 == item.ID).length != 0
                    ? dataSource.filter((da) => da.col1 == item.ID)[0].col11 !=
                      ""
                      ? dataSource.filter((da) => da.col1 == item.ID)[0].col11
                      : "0"
                    : "0",
                duphoi:
                  dataSource.filter((da) => da.col1 == item.ID).length != 0
                    ? dataSource.filter((da) => da.col1 == item.ID)[0].col12 !=
                      ""
                      ? dataSource.filter((da) => da.col1 == item.ID)[0].col12
                      : "0"
                    : "0",
                khuon: "0",
                chuakhuon: "0",
                khuontam: "0",
                khuonsanxuat: "0",
                idbom: item.idbom,
                idenovia: item.idenovia,
              },
            ]);
          });
        } else {
          parentbom.indexchild
            ? (url = "http://113.174.246.52:7978/api/LoadEbomtemp")
            : (url = "http://113.174.246.52:7978/api/LoadAllebom");
          var id = parentbom.id;
          axios.post(url, { id: id }).then((res) => {
            if (res.data.length != 0) {
              setDatambom([]);
              var data = res.data;
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
                softdata(data, list).map((en) => en.Slcum)
              );
              softdata(data, list).map((item, index) => {
                setDatambom((datambom) => [
                  ...datambom,
                  {
                    key: index,
                    no: index + 1,
                    level: lever[index],
                    level2: item.level,
                    ID: item.idmaterial,
                    Name: item.namematerial,
                    vatlieu: item.vatlieu,
                    xuatxu: item.xuatxu,
                    slcum: item.Slcum,
                    slxe: Slxe[index],
                    info2: item.info,
                    note: item.note,
                    tieuhao:
                      dataSource.filter((da) => da.col1 == item.ID).length != 0
                        ? dataSource.filter((da) => da.col1 == item.ID)[0]
                            .col11 != ""
                          ? dataSource.filter((da) => da.col1 == item.ID)[0]
                              .col11
                          : "0"
                        : "0",
                    duphoi:
                      dataSource.filter((da) => da.col1 == item.ID).length != 0
                        ? dataSource.filter((da) => da.col1 == item.ID)[0]
                            .col12 != ""
                          ? dataSource.filter((da) => da.col1 == item.ID)[0]
                              .col12
                          : "0"
                        : "0",
                    khuon: "0",
                    chuakhuon: "0",
                    khuontam: "0",
                    khuonsanxuat: "0",
                    idbom: item.idbom,
                    idenovia: item.idenovia,
                  },
                ]);
              });
            }
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
    var url = "";
    if (parentbom.indexchild) {
      url = "http://113.174.246.52:7978/api/DoneMbom";
      var id = parentbom.id;
      axios
        .post(url, { id: id })
        .then((res) => {
          if (res.data.length != 0) {
            if (parentbom.indexchild) {
              let newArray = [...datachild];
              newArray[
                newArray.indexOf(
                  newArray.filter((da) => da.id == parentbom.id)[0]
                )
              ].statusmbom = 2;
              setDatachild(newArray);
            }
            notification["success"]({
              message: "Thông báo",
              description: "Lưu thành công",
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
    } else {
      if (
        datachild.filter((da) => da.idbom == parentbom.id && da.statusmbom == 2)
          .length == 8
      ) {
        url = "http://113.174.246.52:7978/api/DoneMbomall";
        var id = parentbom.id;
        axios
          .post(url, { id: id })
          .then((res) => {
            if (res.data.length != 0) {
              if (parentbom.indexchild) {
                let newArray = [...datachild];
                newArray[
                  newArray.indexOf(
                    newArray.filter((da) => da.id == parentbom.id)[0]
                  )
                ].statusmbom = 2;
                setDatachild(newArray);
              }
              notification["success"]({
                message: "Thông báo",
                description: "Lưu thành công",
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
      } else {
        notification["error"]({
          message: "Thông báo",
          description: "Dữ liệu Mbom cụm chưa đầy đủ",
        });
      }
    }
    // var url = "";
    // parentbom.indexchild
    //   ? (url = "http://113.174.246.52:7978/api/DoneMbom")
    //   : (url = "http://113.174.246.52:7978/api/DoneMbomall");
  };

  const handleSaveEbom = () => {
    var check = JSON.stringify(datambom).match(/:null[\},]/) != null;
    if (check) {
      notification["error"]({
        message: "Thông báo",
        description: "Bạn chưa nhập đầy đủ thông tin",
      });
    } else {
      let newArray = [...datachild];
      newArray[
        newArray.indexOf(newArray.filter((da) => da.id == parentbom.id)[0])
      ].statusmbom = 1;
      var url = "http://113.174.246.52:7978/api/Insertmbomtemp";
      var id = bom.id;
      var data = datambom;
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
        description: "Dữ liệu đã được lưu",
      });
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...datambom];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDatambom(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDatambom(newData);
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
      title: "Tên vật tư",
      dataIndex: "Name",
      key: "member",
      editable: true,
      ...getColumnSearchProps("Name"),
    },
    {
      title: "Mã vật tư",
      dataIndex: "ID",
      key: "name",
      ...getColumnSearchProps("ID"),
    },
    {
      title: "Thông số kỹ thuật",
      dataIndex: "info2",
      key: "info2",
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
    },
    {
      title: "SL/Xe",
      dataIndex: "slxe",
      key: "sl2",
    },
    {
      title: "%Tiêu hao",
      dataIndex: "tieuhao",
      key: "dvt",
      editable: true,
    },
    {
      title: "%Lượng dư phôi",
      dataIndex: "duphoi",
    },
    {
      title: "Tình trạng khuôn",
      children: [
        {
          title: "Chưa có",
          dataIndex: "chuakhuon",
          key: "Telinhkien",
          editable: true,
        },
        {
          title: "Khuôn tạm",
          dataIndex: "khuontam",
          key: "Malinhkien",
          editable: true,
        },
        {
          title: "Khuôn sản xuất",
          dataIndex: "khuonsanxuat",
          editable: true,
        },
      ],
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
      },
    },
  ];
  const handleExportExcel = () => {
    var header = [];
    columns.map((val, index) => {
      val.children
        ? val.children.map((da) => header.push(da.title))
        : header.push(val.title);
    });
    var databody = [...datambom];
    // delete databody["idenovia"];
    // delete databody["key"];
    databody.filter((da) => {
      delete da["key"];
      delete da["level2"];
      delete da["slcum"];
      delete da["idbom"];
      delete da["idenovia"];
    });
    downloadExcel({
      fileName: "MBOM" + Date(),
      sheet: "MBOM",
      tablePayload: {
        header,
        // accept two different data structures
        body: databody,
      },
    });
  };
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
              M-BOM {parentbom.indexchild && ` (${parentbom.namechild})`}
            </Button>
          </Divider>
        </Col>
        <Col span={6}>
          <Divider orientation="right">
            {username.filter((da) => da.idunit == parentbom.IDunit)[0].level >
            4 ? (
              showfinish && (
                <Fragment>
                  <Button onClick={handleExportMBom} type="primary">
                    Hoàn thành
                  </Button>
                  <Button onClick={handleExportExcel} type="primary">
                    Excel
                  </Button>
                </Fragment>
              )
            ) : (
              <Button onClick={handleSaveEbom} type="primary">
                Lưu M-BOM
              </Button>
            )}
          </Divider>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="mbomtitle">
          <img src={logo} className="imgnav"></img>
        </Col>
        <Col span={12} className="ebomtitle align-items-center text-center">
          <div style={{ width: "100%" }}>
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              DANH MỤC VẬT TƯ SẢN XUẤT
            </p>
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {parentbom.Namebom}
            </p>
          </div>
        </Col>
        <Col span={6} className="mbomtitle">
          <div style={{ width: "100%" }}>
            <p>Mã hóa: QT.RDOT.TTTK/01- BM07</p>
            <p>Đơn vị: R&D Ô tô</p>
            <p>{`Số: ${parentbom.NoBom}`}</p>
            <p>{`Ngày: ${new Date(parentbom.TimeCreate).getDate()}/${
              new Date(parentbom.TimeCreate).getMonth() + 1
            }/${new Date(parentbom.TimeCreate).getFullYear()}`}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form form={form} component={false}>
            <Table
              className="tbmbom"
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
              dataSource={datambom}
            />
          </Form>
        </Col>
      </Row>
    </div>
  );
}
