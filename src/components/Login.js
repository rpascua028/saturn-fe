import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Login() {
  const [form] = Form.useForm();
  const [message, setMessage] = useState({ text: null, type: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there is an error message in the location state
    if (location.state && location.state.error) {
      setMessage({
        text: location.state.error,
        type: 'error',
      });
      // Optionally, clear the navigation state to avoid displaying the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (values) => {
    const { email } = values;
    try {
      await authService.login(email);
      setMessage({
        text: 'An email was sent to you with the login link.',
        type: 'success',
      });
      form.resetFields();
    } catch (error) {
      setMessage({
        text: 'Invalid credentials. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-9 rounded-lg shadow-lg">
        <Form form={form} onFinish={handleLogin}>
          <Title level={2} className="text-center">Login</Title>
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
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Send Login Link
            </Button>
          </Form.Item>
          <Form.Item>
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Don't have an account? Register now
          </Link>
        </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
