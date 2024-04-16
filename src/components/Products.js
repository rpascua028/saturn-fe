import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { fetchGet } from '../services/services';
import { Table, Input, Button, Space, Modal, Checkbox, Row, Col, notification } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

const ITEMS_PER_PAGE = 10;

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false); // Flag to control search calls
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  // Create a ref to track whether fetchProducts has been called
  const fetchProductsCalled = useRef(false);

  const fetchProducts = useCallback(async (page = 1, query = searchQuery) => {
    setIsLoading(true);
    const url = `products?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}&search=${query}&ordering=${sortDirection === 'asc' ? '' : '-'}${sortColumn}`;
    try {
      const data = await fetchGet(url);
      if (data) {
        setProducts(data.results);
        setTotalCount(data.count);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortColumn, sortDirection, navigate]);

  useEffect(() => {
    // Call fetchProducts only if it has not been called before or searchFlag is true
    if (!fetchProductsCalled.current || searchFlag) {
      fetchProductsCalled.current = true;
      console.log("was called")
      fetchProducts();
      // Reset searchFlag to false after calling fetchProducts during search
      setSearchFlag(false);
    }
  }, [fetchProducts, searchFlag]); // Include searchFlag as a dependency

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSearchFlag(true); // Set the flag to trigger fetchProducts during search
  };

  const handleAddProduct = () => {
    navigate('/dashboard/add-product');
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

  // Update the Table component's onChange handler to include sorting
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortColumn(sorter.field);
      setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
    // Call fetchProducts when changing sorting
    fetchProducts(pagination.current);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      render: (text, record) => <Link to={`/dashboard/edit-product/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => <Link to={`/dashboard/edit-product/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Top Category',
      dataIndex: 'category',
      key: 'category',
      render: categories => categories?.[0]?.name || 'No Category',
    },
    {
      title: 'Brand',
      dataIndex: ['brand', 'name'],
      key: 'brand.name',
      sorter: true,
    },
    {
      title: 'Is Active?',
      dataIndex: 'is_active',
      key: 'is_active',
      sorter: true,
      render: is_active => <Checkbox checked={is_active} disabled />,
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

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Product List</h1>
        </Col>
      </Row>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </Col>
        <Col>
          <Search
            placeholder="Search products"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </Col>
      </Row>

      <Table
        size="small"
        dataSource={products}
        columns={columns}
        pagination={{
          total: totalCount,
          pageSize: ITEMS_PER_PAGE,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
            setSearchFlag(false); // Reset the flag when changing the page
          },
        }}
        onChange={handleTableChange} // Pass the sorting handler
        loading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isDeleteConfirmationOpen}
        onCancel={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default Products;
