import React, { useState } from 'react';
import { Modal, Button, Upload, Select, Form, Spin, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import authService from '../services/authService';

const { Option } = Select;

const openNotification = (type, msg, description) => {
  notification[type]({
    message: msg,
    description,
  });
};

const UploadModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [fileList, setFileList] = useState([]);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (!values.file || values.file.length === 0) {
        openNotification('error', 'Error', 'Failed to upload file. No file selected.');
        setLoading(false);
        return;
      }

      const file = values.file[0].originFileObj;

      const formData = new FormData();
      formData.append('role', values.role);
      formData.append('file', file);

      const response = await axios.post(`${apiUrl}/users/upload_member`, formData, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        openNotification('success', 'Successful', 'File uploaded successfully.');
        onCloseModal();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      openNotification('error', 'Error', 'Failed to upload file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
    form.setFieldsValue({ file: info.fileList });
    return info.fileList;
  };

  return (
    <Modal
      title="Upload Member"
      visible={isVisible}
      onOk={handleUpload}
      onCancel={onCloseModal}
      okText="Upload"
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={onCloseModal}>
          Cancel
        </Button>,
        <Button
  key="submit"
  type="primary"
  loading={loading}
  onClick={async () => {
    try {
      // Perform form validation
      await form.validateFields();
      // If validation is successful, proceed with the upload
      handleUpload();
    } catch (error) {
    
    }
  }}
>
          Upload
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Selecting a role is mandatory' }]}
          >
            <Select placeholder="Select a role">
              <Option value="unit_owner">Unit Owner</Option>
              <Option value="tenant_buyer">Tenant Buyer</Option>
              <Option value="broker">Broker</Option>
              <Option value="referrer">Referrer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: 'Uploading a file is mandatory' }]}
            valuePropName="fileList"
            getValueFromEvent={handleFileChange}
          >
            <Upload
              beforeUpload={() => false}
              accept=".csv"
              listType="text"
              onChange={handleFileChange}
            >
              {fileList.length < 1 && <Button icon={<UploadOutlined />}>Select CSV File</Button>}
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UploadModal;
