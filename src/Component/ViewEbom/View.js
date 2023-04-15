import React from "react";
import logo from "../../Library/images/LOGO THACO AUTO.png";
import Context from "../../Data/Context";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
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
import { Fragment } from "react";

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
export default function View() {
  const {
    datachild,
    setDatachild,
    username,
    dataebom,
    setDataebom,
    parentbom,
    listBom,
    setListBom,
  } = React.useContext(Context);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");
  const [showfinish, setShowfinish] = React.useState(false);
  let navigate = useNavigate();
  React.useEffect(() => {
    var url = "http://113.174.246.52:7978/api/LoadAllebom";
    var id = parentbom.id;
    axios
      .post(url, { id: id })
      .then((res) => {
        if (res.data.length != 0) {
          setDataebom([]);
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
          data.map((item, index) => {
            setDataebom((dataebom) => [
              ...dataebom,
              {
                key: index,
                no: index + 1,
                level: lever[index],
                level2: item.level,
                Amount: item.amountchange,
                info: item.infochange,
                Name: item.namematerial,
                ID: item.idmaterial,
                img: item.image,
                vatlieu: item.vatlieu,
                xuatxu: item.xuatxu,
                info2: item.info,
                Quycach: item.Quycach,
                Quycachdotlo: item.Quycachdotlo,
                dvt: item.DVT,
                slcum: item.Slcum,
                slxe: Slxe[index],
                Tenlinhkien: item.Tenlinhkien,
                Malinhkien: item.Malinhkien,
                khuon: item.Khuon,
                note: item.note,
                idenovia: item.idenovia,
              },
            ]);
          });
          setShowfinish(true);
        } else
          notification["error"]({
            message: "Thông báo",
            description: "Chưa có dữ liệu",
          });
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
    if (
      datachild.filter((da) => da.idbom == parentbom.id && da.status == 2)
        .length == 8
    ) {
      var url = "http://113.174.246.52:7978/api/DoneEbomall";
      var id = parentbom.id;
      axios
        .post(url, { id: id })
        .then((res) => {
          if (res.data.length != 0) {
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
      console.log(listBom, parentbom);
      let newArray = [...listBom];
      newArray[
        newArray.indexOf(newArray.filter((da) => da.id == parentbom.id)[0])
      ].DoneEbom = 1;
      setListBom(newArray);
      console.log(listBom, parentbom);
    } else {
      notification["error"]({
        message: "Thông báo",
        description: "Dữ liệu Ebom cụm chưa đầy đủ",
      });
    }
  };

  const handleSaveEbom = () => {
    var check = JSON.stringify(dataebom).match(/:null[\},]/) != null;
    if (check) {
      notification["error"]({
        message: "Thông báo",
        description: "Bạn chưa nhập đầy đủ thông tin",
      });
    } else {
      var url = "http://113.174.246.52:7978/api/Insertebomtemp";
      var id = parentbom.id;
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

  const handleExportExcel = () => {
    var header = [];
    columns.map((val, index) => {
      val.children
        ? val.children.map((da) => header.push(da.title))
        : header.push(val.title);
    });
    var databody = [...dataebom];
    // delete databody["idenovia"];
    // delete databody["key"];
    databody.filter((da) => {
      delete da["key"];
      delete da["level2"];
      delete da["idbom"];
      delete da["idenovia"];
    });
    downloadExcel({
      fileName: "EBOM" + Date(),
      sheet: "EBOM",
      tablePayload: {
        header,
        // accept two different data structures
        body: databody,
      },
    });
  };
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
              E-BOM
            </Button>
          </Divider>
        </Col>
        <Col span={6}>
          <Divider orientation="right">
            {username.filter((da) => da.idunit == parentbom.IDunit)[0].level ==
              3 &&
              showfinish && (
                <Fragment>
                  <Button onClick={handleExportMBom} type="primary">
                    Xác nhận Ebom
                  </Button>
                  <Button onClick={handleExportExcel} type="primary">
                    Excel
                  </Button>
                </Fragment>
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
            <h5>{parentbom.Namebom}</h5>
          </div>
        </Col>
        <Col span={6} className="ebomtitle">
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
                  : "nomal"
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
