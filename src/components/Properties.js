import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { fetchGet } from '../services/services';
import {
  Table, Input, Button, Space, Modal, Checkbox, Row, Col, notification, Select, Upload, message
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';


const { Search } = Input;

const ITEMS_PER_PAGE = 10;


const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [searchFlag, setSearchFlag] = useState(false); // Flag to control search calls
  const apiUrl = process.env.REACT_APP_API_BASE_URL;


  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

  // Create a ref to track whether fetchProducts has been called
  const fetchPropertiesCalled = useRef(false);

  const fetchProperties = useCallback(debounce(async (page = 1) => {
    setIsLoading(true);
   
    const url = `properties?limit=${pageSize}&offset=${(page - 1) * pageSize}&search=${searchQuery}&ordering=${sortDirection === 'asc' ? '' : '-'}${sortColumn}`;
    console.log(url)
    try {
      const data = await fetchGet(url);
      if (data) {
        setProperties(data.results);
        setTotalCount(data.count);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setIsLoading(false);
    }
  }, 300), [pageSize , searchQuery, sortColumn, sortDirection, apiUrl]);
  
  useEffect(() => {
    // This checks if products should be fetched either due to page or search changes.
    if (!fetchPropertiesCalled.current || searchFlag) {
      fetchPropertiesCalled.current = true;
      fetchProperties(currentPage);
      setSearchFlag(false); // Reset search flag after fetching
    }
  }, [fetchProperties, currentPage, searchFlag]);

  useEffect(() => {
  // This effect should ideally only trigger when it's necessary to fetch new data
  fetchProperties(currentPage);
  // Make sure to not reset currentPage here unless under specific conditions
}, [currentPage, pageSize]); 


  const handleSearch = (value, input) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSearchFlag(true); // Set the flag to trigger fetchProducts during search
  };


  const handleAddProperties = () => {
    navigate('/dashboard/add-properties');
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/properties/${selectedProject.id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
      });
      fetchProperties(); // Fetch products after deletion
    } catch (error) {
      console.error('Error deleting product', error);
    }
    openNotification('info', 'Success', 'Record/s successfully deleted.');
    setIsDeleteConfirmationOpen(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const newSortDirection = sorter.order === 'ascend' ? 'asc' : 'desc';
    let newSortColumn = sorter.field || 'created_at';  // Default to 'created_at' if no sorter.field provided

    if (newSortColumn === 'leasing_specialist_details.full_name') {
      newSortColumn = 'leasingspecialist_details__full_name'; // This should match the backend's expected format for nested sorting
    }

    if (sortColumn !== newSortColumn || sortDirection !== newSortDirection) {
        setSortColumn(newSortColumn);
        setSortDirection(newSortDirection);
        fetchProperties(pagination.current);
    }

    if (currentPage !== pagination.current) {
        setCurrentPage(pagination.current);
    }
};

  const columns = [
    {
      title: 'REFERENCE',
      dataIndex: 'reference',
      key: 'reference',
      sorter: true,
      render: (text, record) => <Link to={`/dashboard/edit-project/${record.id}`} className="link-style">{text}</Link>,
    },
    {
      title: 'PROPERTY NAME',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      // render: (text, record) => <Link to={`/dashboard/edit-product/${record.id}`}>{text}</Link>,
    },
    
    {
      title: 'BRAND',
      dataIndex: 'brand',
      key: 'brand',
      sorter: true,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
    },
    {
      title: 'LOCATION MAP',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: true,
      render: (text, record) => <a href={`your-link-path/${text}`}>{text}</a>,
    }
    ,
    {
      title: 'Leasing Specialist',
      dataIndex: 'leasing_specialist_details.full_name',
      key: 'leasing_specialist_details.full_name',
      sorter: true,
      render: (text, record) => record.leasing_specialist_details ? record.leasing_specialist_details.full_name : 'Not Assigned'
    },
    {
      title: 'LEASING/RESALE Manager',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
    },



  


    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            onClick={() => {
              setSelectedProject(record);
              setIsDeleteConfirmationOpen(true);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  
  const ConfirmationDialog = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <Modal
        title="Confirm Deletion"
        visible={isOpen}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" danger onClick={onConfirm}>
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
    );
  };


  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAction(undefined); 
  };


  const handleSelectAction = value => {
    setSelectedAction(value);
    if (value === "upload_members") {
      setIsModalVisible(true);
    }
    // Handle other actions like export here if necessary
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Product List</h1>
        </Col>
      </Row>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Row justify="space-between" align="left">
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProperties}
            >
              Add Member
            </Button>
          </Col> 

          <Col>
            <Select
              style={{ width: 150, marginLeft: 8 }}
              placeholder="Select Action"
              onChange={handleSelectAction}
              value={selectedAction}  // Bind the selected value to the state
            >
              <Select.Option value="upload_properties">Upload Properties</Select.Option>
              <Select.Option value="export_all">Export All</Select.Option>
            </Select>

            
          </Col> 
          </Row>
        </Col>

  


        <Col>
          <Row justify="space-between" align="left">
    
          <Search
              placeholder="Search products"
              onSearch={handleSearch }
              style={{ width: 300 }}
            />
          </Row>


        </Col>
      </Row>

      <Table
        size="small"
        dataSource={properties}
        columns={columns}
        pagination={{
          total: totalCount,
          pageSize: pageSize,
          current: currentPage,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize); // Ensure the pageSize state updates when page changes
            setSearchFlag(true); // Set flag to true to trigger data fetching
          },
          onShowSizeChange: (current, size) => {
            setPageSize(size);
            setCurrentPage(1); // Optionally reset to first page
            setSearchFlag(true); // Set flag to true to trigger data fetching
          },
          showSizeChanger: true, // Enables the dropdown to change page size
          pageSizeOptions: ['10', '20', '50', '100'], // Define page size options
        }}
        onChange={handleTableChange} // Handle sorting changes
        loading={isLoading}
        scroll={{ x: 'max-content' }} // Enables horizontal scrolling based on content width
      />

      <ConfirmationDialog
        isOpen={isDeleteConfirmationOpen}
        onCancel={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default Properties;
