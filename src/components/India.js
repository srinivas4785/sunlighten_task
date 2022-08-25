import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./India.css";
import { Select } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';

import Highlighter from 'react-highlight-words';
function India() {
  const [state, setStates] = useState([]);
  const [data, setData] = useState([]);
  const [selectdata, setSelectdata] = useState([]);
  const [dist, setDist] = useState([]);
  const [selectdist, setSelectdist] = useState([]);
  const [selectdist1, setSelectdist1] = useState([]);
  const [selectdist2, setSelectdist2] = useState([]);
  const[data2,setData2]=useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const { Option } = Select;

  const handleChange = (value) => {
    let data1 = Object.keys(data[value].dates)[
      Object.keys(data[value].dates).length - 1
    ]; // for last key of the object
    setSelectdata(data[value].dates[data1].total);
    setSelectdist(Object.keys(dist[value].districts));
    setSelectdist1(dist[value].districts);
  };
  const handleChange1 = (value) => {
    setSelectdist2(selectdist1[value].total);
  };
  useEffect(() => {
    axios
      .get("https://data.covid19india.org/v4/min/timeseries.min.json")
      .then((res) => {
        setData(res.data);
        let arr2 = [];
        Object.keys(res.data).map((data12) => {
          let obj = {
            ...res.data[data12].dates[Object.keys(res.data[data12].dates).pop()].total,
            state:data12
          };
          arr2.push(obj);
        });
        setData2(arr2)
        setStates(Object.keys(res.data));
      });

    axios
      .get("https://data.covid19india.org/v4/min/data.min.json")
      .then((res) => {
        setDist(res.data);
        console.log(res.data)
      });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: '30%',
      // sorter: (a, b) => a.deceased - b.deceased,
      // ...getColumnSearchProps('state'),
    },
    {
      title: 'confirmed',
      dataIndex: 'confirmed',
      key: 'confirmed',
      width: '20%',
      sorter: (a, b) => a.deceased - b.deceased,
      ...getColumnSearchProps('confirmed'),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'deceased',
      dataIndex: 'deceased',
      key: 'deceased',
      // ...getColumnSearchProps('deceased'),
      // sorter: (a, b) => a.deceased - b.deceased,
    },
    {
      title: 'recovered',
      dataIndex: 'recovered',
      key: 'recovered',
      // ...getColumnSearchProps('recovered'),
      // sorter: (a, b) => a.recovered - b.recovered,
    },
    {
      title: 'tested',
      dataIndex: 'tested',
      key: 'tested',
      // ...getColumnSearchProps('tested'),
      // sorter: (a, b) => a.tested - b.tested,
    },
    {
      title: 'vaccinated1',
      dataIndex: 'vaccinated1',
      key: 'vaccinated1',
      // ...getColumnSearchProps('vaccinated1'),
      // sorter: (a, b) => a.vaccinated1 - b.vaccinated1,
    },
    {
      title: 'vaccinated2',
      dataIndex: 'vaccinated2',
      key: 'vaccinated2',
      // ...getColumnSearchProps('vaccinated2'),
      // sorter: (a, b) => a.vaccinated2 - b.vaccinated2,
    },
  ];

  return (
    <div className="fluid-container py-5">
      <Select
        defaultValue="states"
        style={{
          width: 120,
        }}
        onChange={handleChange}
      >
        {state.map((data) => (
          <Option value={data}>{data}</Option>
        ))}
      </Select>

      <table class="table">
        <thead>
          <tr>
            <th>confirmed</th>
            <th>deceased</th>
            <th>recovered</th>
            <th>tested</th>
            <th>vaccinated1</th>
            <th>vaccinated2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectdata.confirmed}</td>
            <td>{selectdata.deceased}</td>
            <td>{selectdata.recovered}</td>
            <td>{selectdata.tested}</td>
            <td>{selectdata.vaccinated1}</td>
            <td>{selectdata.vaccinated2}</td>
          </tr>
        </tbody>
      </table>

      <Select
        defaultValue="districts"
        style={{
          width: 120,
        }}
        onChange={handleChange1}
      >
        {selectdist.map((data) => (
          <Option value={data}>{data}</Option>
        ))}
      </Select>

      <table class="table">
        <thead>
          <tr>
            <th>confirmed</th>
            <th>deceased</th>
            <th>recovered</th>
            <th>tested</th>
            <th>vaccinated1</th>
            <th>vaccinated2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectdist2.confirmed}</td>
            <td>{selectdist2.deceased}</td>
            <td>{selectdist2.recovered}</td>
            <td>{selectdist2.tested}</td>
            <td>{selectdist2.vaccinated1}</td>
            <td>{selectdist2.vaccinated2}</td>
          </tr>
        </tbody>
      </table>



      return <Table columns={columns} dataSource={data2} />;
    </div>
  );
}

export default India;
