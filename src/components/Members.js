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
import UploadModal from './MemberUploadModal'; 

const { Search } = Input;

const ITEMS_PER_PAGE = 10;


const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const Members = () => {
  const [products, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userType, setUserType] = useState('');
  const [userStatus, setUserStatus] = useState('');
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
  const fetchProductsCalled = useRef(false);

  const fetchProducts = useCallback(debounce(async (page = 1) => {
    setIsLoading(true);
   
    const url = `users?limit=${pageSize}&offset=${(page - 1) * pageSize}&role=${userType}&status=${userStatus}&search=${searchQuery}&ordering=${sortDirection === 'asc' ? '' : '-'}${sortColumn}`;
    console.log(url)
    try {
      const data = await fetchGet(url);
      if (data) {
        setMembers(data.results);
        setTotalCount(data.count);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setIsLoading(false);
    }
  }, 300), [pageSize, userType, userStatus, searchQuery, sortColumn, sortDirection, apiUrl]);
  
  useEffect(() => {
    // This checks if products should be fetched either due to page or search changes.
    if (!fetchProductsCalled.current || searchFlag) {
      fetchProductsCalled.current = true;
      fetchProducts(currentPage);
      setSearchFlag(false); // Reset search flag after fetching
    }
  }, [fetchProducts, currentPage, searchFlag]);

  useEffect(() => {
  // This effect should ideally only trigger when it's necessary to fetch new data
  fetchProducts(currentPage);
  // Make sure to not reset currentPage here unless under specific conditions
}, [currentPage, pageSize]); 


  const handleSearch = (value, input) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSearchFlag(true); // Set the flag to trigger fetchProducts during search
  };

  const handleUserTypeChange = value => {
    if (userType !== value) {
      setUserType(value);
      setSearchFlag(true); // Triggers re-fetch
    }
  };
  
  const handleUserStatusChange = value => {
    setUserStatus(value);
    setSearchFlag(true); // This triggers useEffect to call fetchProducts
  };

  const handleAddProduct = () => {
    navigate('/dashboard/add-member');
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/admin/products/${selectedProduct.id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
      });
      fetchProducts(); // Fetch products after deletion
    } catch (error) {
      console.error('Error deleting product', error);
    }
    openNotification('info', 'Record/s successfully deleted.');
    setIsDeleteConfirmationOpen(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const newSortDirection = sorter.order === 'ascend' ? 'asc' : 'desc';
    if (sortColumn !== sorter.field || sortDirection !== newSortDirection) {
      setSortColumn(sorter.field);
      setSortDirection(newSortDirection);
      fetchProducts(pagination.current);
      setSortColumn('created_at')
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
      render: (text, record) => <Link to={`/dashboard/view-member/${record.id}`} className="link-style">{text}</Link>,
    },
    {
      title: 'NAME',
      dataIndex: 'full_name',
      key: 'first_name',
      sorter: true,
      // render: (text, record) => <Link to={`/dashboard/edit-product/${record.id}`}>{text}</Link>,
    },
    
    {
      title: 'MIDDLE NAME',
      dataIndex: 'middle_name',
      key: 'middle_name',
      sorter: true,
    },
    {
      title: 'MOBILE COUNTRY CODE',
      dataIndex: 'mobile_country_code',
      key: 'mobile_country_code',
      sorter: true,
    },
    {
      title: 'MOBILE NUMBER',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: true,
    },
    {
      title: 'ALT MOBILE COUNTRY CODE',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: true,
    },
    {
      title: 'ALT MOBILE NUMBER',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'LANDLINE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },

    {
      title: 'ALT EMAIL',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'OTHER EMAIL',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'CONTRACT THRU',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BIRTHDAY',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'COMPANY',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'NATIONALITY',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'MARITAL STATUS',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'NAME OF SPOUSE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (role) => {
        switch (role) {
          case 'tenant_buyer':
            return 'Tenant Buyer';
          case 'broker':
            return 'Broker';
          case 'unit_owner':
            return 'Unit Owner';
          case 'referrer':
            return 'Referrer';
          default:
            return role;  // Fallback to raw value if none of the above
        }
      },
    },

    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) => {
        switch (status) {
          case 'pending':
            return 'For Approval';
          case 'approved':
            return 'Approved';
          default:
            return status;  // Fallback to raw value if none of the above
        }
      },
    },

    {
      title: 'REGISTERED?',
      dataIndex: '',
      key: '',
    },

    {
      title: 'APPROVED??',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'REGISTRATION DATE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'REFERRER TYPE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'SOURCE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER AGENCY TYPE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER TYPE',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER CORPORATION NAME',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER PRC LICENSE NUMBER',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER SEC REGISTRATION NUMBER',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER TIN',
      dataIndex: '',
      key: '',
      sorter: true,
    },

    {
      title: 'BROKER WEBSITE',
      dataIndex: '',
      key: '',
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
              setSelectedProduct(record);
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
        <p>Are you sure you want to delete this product?</p>
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
              onClick={handleAddProduct}
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
              <Select.Option value="upload_members">Upload Member</Select.Option>
              <Select.Option value="export_page">Export Page</Select.Option>
              <Select.Option value="export_all">Export All</Select.Option>
            </Select>

            
          </Col> 
          </Row>
        </Col>

        <UploadModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />


        <Col>
          <Row justify="space-between" align="left">
          <Col>
            <Select
          style={{ width: 150 }}
          placeholder="User Status"
          value={userStatus}  // This binds the Select component value to the state
          onChange={handleUserStatusChange}
              // onChange={handleRoleChange} // Uncomment and replace with your actual onChange handler
            >
              <Select.Option value="">All</Select.Option>
              <Select.Option value="pending">For Approval</Select.Option>
              <Select.Option value="for_invitation">For Invitation</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              style={{ width: 150 }}  // Ensures the select takes full width of the column
              placeholder="User Type"
              dropdownStyle={{ minWidth: 200 }}
              value={userType}  // This binds the Select component value to the state
              onChange={handleUserTypeChange}
              // onChange={handleRoleChange} // Uncomment and replace with your actual onChange handler
            >
              <Select.Option value="">All</Select.Option>
              <Select.Option value="unit_owner">Unit Owner</Select.Option>
              <Select.Option value="tenant_buyer">Tenant Buyer</Select.Option>
              <Select.Option value="broker">Broker</Select.Option>
              <Select.Option value="referrer">Referrer</Select.Option>
            </Select>
          </Col>

          <Col>
          <Search
              placeholder="Search products"
              onSearch={handleSearch }
              style={{ width: 300 }}
            />
            </Col>
          </Row>


        </Col>
      </Row>

      <Table
        size="small"
        dataSource={products}
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

export default Members;
