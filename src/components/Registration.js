import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Select, notification } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;


const Registration = () => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState({ text: null, type: null });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;


  const openNotification = (type, message, description) => {
      notification[type]({
      message,
      description,
    });
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      console.log(values);
  
      const registerUrl = `${apiUrl}/users/register`

      const productResponse = await axios({
        method: 'POST',
        url: registerUrl,
        data: values,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      openNotification('success', 'Record successfully saved.', '');
    } catch (error) {
      setLoading(false);
      console.error('Error saving product:', error);
      openNotification('error', 'System Error.', `API Error: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-9 rounded-lg shadow-lg">
        <Form form={form} onFinish={handleRegister}>
          <Title level={2} className="text-center">Register</Title>
          {message.text && (
            <Alert
              message={message.text}
              type={message.type}
              showIcon
              closable
              onClose={() => setMessage({ text: null, type: null })}
              className="mb-4"
            />
          )}
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: 'Please enter your first name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: 'Please enter your last name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="mobile"
            rules={[{ required: true, message: 'Please enter your mobile number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Mobile" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select your role">
              <Select.Option value="tenant_buyer">Tenant Buyer</Select.Option>
              <Select.Option value="broker">Broker</Select.Option>
              <Select.Option value="referrer">Referrer</Select.Option>          
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Registration;