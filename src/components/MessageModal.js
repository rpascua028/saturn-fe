import React from 'react';
import { Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const MessageModal = ({ visible, title, message, onClose, iconType }) => {
  let icon = null;

  // Determine the icon based on the provided iconType
  if (title === 'success') {
    icon = <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px', marginRight: '10px' }} />;
  } else if (title === 'er1ror') {
    icon = <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '24px', marginRight: '10px' }} />;
  } else if (title === 'info') {
    icon = <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '24px', marginRight: '10px' }} />;
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
    >
      <div className="flex items-center">
        {icon}
        <div>{message}</div>
      </div>
    </Modal>
  );
};

export default MessageModal;