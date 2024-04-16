import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { fetchGet } from '../services/services';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Upload, Modal, Spin, Popconfirm, notification, Row, Col, Menu, Dropdown, Select,
Checkbox, DatePicker} from 'antd';
import { SaveOutlined, PlusOutlined, UploadOutlined, QuestionCircleOutlined, DownOutlined, CloseCircleOutlined} from '@ant-design/icons';
const { TextArea } = Input;

const MemberAddUpdate = ({ mode }) => {
  const { memberId } = useParams();

  const [accountStatus, setAccountStatus] = useState('');
  const [editMode, setEditMode] = useState(mode);
  const [prcPhotoUrl, setPrcPhotoUrl] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);

  const [formData, setFormData] = useState(new FormData());
  const navigate = useNavigate();
  const fetchedCategoryDetailsRef = useRef(false);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
    const formRef = useRef();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if ((mode === 'view' || mode === 'edit') && !fetchedCategoryDetailsRef.current) {
     
      const fetchCategoryDetails = async () => {
        try {
          const userDetails = await fetchGet(`users/${memberId}`);
          
          const status = userDetails.status; // Assuming the response has a `status` field

          setAccountStatus(status);

          setSelectedRole(userDetails.role)

          console.log(userDetails)

          if (userDetails) {
            const fieldsValue = {
              reference: userDetails.reference,
              first_name: userDetails.first_name,
              last_name: userDetails.last_name,
              role: userDetails.role,
              email: userDetails.email,
              mobile: userDetails.mobile,
              nationality: userDetails.nationality,
              // Other fields not dependent on being a broker go here
            };
          
            // Check if the role is "broker" and user_details is not null
            if (userDetails.role === 'broker' && userDetails.user_details !== null) {
              fieldsValue.agency_type = userDetails.user_details.agency_type;
              fieldsValue.corporation_name = userDetails.user_details.corporation_name;
              fieldsValue.sec_registration_number = userDetails.user_details.sec_registration_number;
              fieldsValue.website = userDetails.user_details.website;
              fieldsValue.prc_license_number = userDetails.user_details.prc_license_number;
            }

            if (userDetails.role === 'referrer' && userDetails.user_details !== null) {
              fieldsValue.is_ayala_group_employee = userDetails.user_details.is_ayala_group_employee;
              setIsEmployee(userDetails.user_details.is_ayala_group_employee)
              fieldsValue.company = userDetails.user_details.company;
              fieldsValue.sbu = userDetails.user_details.sbu;
              fieldsValue.government_id_type = userDetails.user_details.government_id_type;
              fieldsValue.government_number = userDetails.user_details.government_number;
              fieldsValue.government_id_expiry = userDetails.user_details.government_id_expiry;
              fieldsValue.tin = userDetails.user_details.tin;
            }
    
            // Set the form fields value
            form.setFieldsValue(fieldsValue);

            if (userDetails.user_details.prc_photo_url) {
              const imageUrls = [{
                uid: userDetails.id || '',
                name: userDetails.user_details.prc_photo.substring(userDetails.user_details.prc_photo.lastIndexOf('/') + 1) || '',
                status: 'done',
                url: userDetails.user_details.prc_photo_url
              }];
  
              setFileList(imageUrls);
          }


          if (userDetails.user_details.government_id_photo_url) {
            const imageUrls = [{
              uid: userDetails.id || '',
              name: userDetails.user_details.government_id_photo.substring(userDetails.user_details.government_id_photo.lastIndexOf('/') + 1) || '',
              status: 'done',
              url: userDetails.user_details.government_id_photo_url
            }];

            setFileList(imageUrls);
        }
        }
        } catch (error) {
          console.error('Error fetching category details:', error);
        }
      };
  
      fetchCategoryDetails();
      fetchedCategoryDetailsRef.current = true;
    }
  }, [mode, memberId]);


  
// Determine the color class based on account status
const getStatusColorClass = (status) => {
  switch(status) {
    case 'pending': return 'text-orange-500';
    case 'Approved': return 'text-green-500';
    case 'Disapproved': return 'text-red-500';
    default: return '';
  }
};

const toggleEditMode = (newMode) => {
  if (newMode === 'edit') {
    setEditMode(newMode);
    navigate(`/dashboard/edit-member/${memberId}`);
  } else {
    // Handle other modes if necessary
    setEditMode(newMode);
  }
};


const handleRoleChange = value => {
  setSelectedRole(value); // Update the local state to reflect the new selection
};


  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };



  const handleFormSubmit = async (values) => {

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Utility function to append fields to formData
      const appendData = (key, value) => {
          formData.append(key, value || '');
      };

      // Append simple text fields
      appendData('role', values.role);
      appendData('email', values.email);
      appendData('first_name', values.first_name);
      appendData('last_name', values.last_name);
      appendData('mobile', values.mobile);
      appendData('nationality', values.nationality);

      if (values.role === 'broker') {
          appendData('broker_details.agency_type', values.agency_type);
          appendData('broker_details.corporation_name', values.corporation_name);
          appendData('broker_details.sec_registration_number', values.sec_registration_number);
          appendData('broker_details.website', values.website);
          appendData('broker_details.prc_license_number', values.prc_license_number);
      } else if (values.role === 'referrer') {
        formData.append('referrer_details.is_ayala_group_employee', values.is_ayala_group_employee || false);
            if(values.is_ayala_group_employee == true){
              appendData('referrer_details.company', values.company);
              appendData('referrer_details.sbu', values.sbu);
            }else{
              appendData('referrer_details.company', '');
              appendData('referrer_details.sbu', '');
            }
         
          appendData('referrer_details.government_id_type', values.government_id_type);
          appendData('referrer_details.government_number', values.government_number);
          appendData('referrer_details.government_id_expiry', values.government_id_expiry);
          appendData('referrer_details.tin', values.tin);
      }

      const appendFileToFormData = (formData, fileList, formDataKey) => {
        if (fileList.length > 0) {
            const file = fileList[0]; // Get the first file from the list

            if (file.originFileObj) {
                // If the file object is available, append it
                formData.append(formDataKey, file.originFileObj);
            } else if (file.url) {
                // If there's a URL, it means the file is already uploaded
                // Optionally delete the form data key if no new file is provided
                formData.delete(formDataKey);
            } else {
                // Append an empty string if no file is selected and no URL is present
                formData.append(formDataKey, '');
            }
        } else {
            // Handle the case where there are no files in the fileList
            formData.append(formDataKey, '');
        }
    };

    appendFileToFormData(formData, fileList, 'broker_details.prc_photo');
    appendFileToFormData(formData, fileList, 'referrer_details.government_id_photo');

        



  
      // Determine the API method and URL based on the mode
      const url = `${apiUrl}/users${mode === 'edit' ? `/${memberId}` : ''}`;
      const method = mode === 'edit' ? 'put' : 'post';
  
      const categoryResponse = await axios({
        method,
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
  
      
      openNotification('success', 'Record successfully saved.');
      fetchedCategoryDetailsRef.current = false;
     // navigate('/dashboard/categories');

     navigate(`/dashboard/view-member/${categoryResponse.data.id}`);
    } catch (error) {
      console.error('Error saving category:', error);
      openNotification('error', 'System Error.', `API Error: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };




  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.url) {
      // Open in a new tab if there's a URL
      window.open(file.url, '_blank');
    }
  };

  const beforeUpload = (file) => {
    const formData = new FormData();
    formData.append('files', file);
    return false; // Prevent automatic upload
  };

  const uploadProps = {
    beforeUpload,
    onChange: handleFileChange,
    onPreview: handlePreview,
    fileList,
    listType: "text", // Change to "picture" for image previews
    showUploadList: {
      showRemoveIcon: mode !== 'view', // Conditionally display the remove icon
    },
  };

  
  
  

  const handleCancel = () => {
    // Handle cancel action here
    console.log('Cancelled');
    if (mode === 'add') {
      navigate(`/dashboard/members`);
    }else{
      navigate(`/dashboard/view-member/${memberId}`);
    }

   
    
  };
  



    return (
        <div className="container mx-auto p-4">
            <Spin spinning={loading} size='large'> {/* Add the Spin component here */}
            <Form form={form}ref={formRef} onFinish={handleFormSubmit} layout="vertical">

              {/* Basic Info */}
              <div>
              <Row gutter={16}>
              <Col span={8}>
                <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white">
                  <h1 className="text-2xl font-bold mb-2">
                    Basic Information
                  </h1>
                  <p className="mb-4">
                    Account Status: <strong className={getStatusColorClass(accountStatus)}>{mode === 'add' ? 'Pending' : (accountStatus)}</strong>
                  </p>
                  <p className="mb-4">
                    Remarks: {accountStatus}
                  </p>
                  {mode === 'view' ? (
                    <div className="flex justify-between items-center">
                      <Dropdown overlay={
                        <Menu onClick={({ key }) => toggleEditMode(key)}>
                          <Menu.Item key="edit">Edit Account</Menu.Item>
                          <Menu.Item key="approve">Approve Account</Menu.Item>
                          <Menu.Item key="disapprove">Disapprove Account</Menu.Item>
                          <Menu.Item key="delete">Delete Account</Menu.Item>
                        </Menu>
                      }>
                        <Button>
                          Select Actions <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  ) : (
                    <Form.Item>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Popconfirm
                          title="Are you sure you want to cancel the transaction?"
                          onConfirm={handleCancel}
                          okText="Yes"
                          cancelText="No"
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                          <Button type="cancel" icon={<CloseCircleOutlined />}
                            style={{ marginRight: '8px' }}>
                            Cancel
                          </Button>
                        </Popconfirm>

                        <Popconfirm
                          title="Save the record?"
                          onConfirm={() => {
                              formRef.current.submit();
                            }}
                          okText="Yes"
                          cancelText="No"
                          icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
                        >
                          <Button type="primary" icon={<SaveOutlined />}>
                            {mode === 'add' ? 'Save' : 'Save Changes'}
                          </Button>
                        </Popconfirm>
                      </div>
                    </Form.Item>
                  )}
                </div>
              </Col>

                    <Col span={16}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white mb-10">
                      <Form.Item
                        label="User Type"
                        name="role"
                        rules={[{ required: true, message: 'User Type is required' }]}
                      >
                        <Select
                          disabled={mode !== 'add'}
                          placeholder="Select User Type"
                          onChange={handleRoleChange} // Set the onChange handler
                        >
                          <Select.Option value="unitOwner">Unit Owner</Select.Option>
                          <Select.Option value="tenant_buyer">Tenant Buyer</Select.Option>
                          <Select.Option value="broker">Broker</Select.Option>
                          <Select.Option value="referrer">Referrer</Select.Option>
                        </Select>
                      </Form.Item>

                      
                        
                        
                        <Form.Item
                            label="Reference"
                            name="reference"
                          >
                            <Input
                              type="text"
                              disabled
                              placeholder={mode === 'view' ? "" :" -- Auto Generated --"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="Email"
                            name="email"
                          
                            rules={[
                              {
                                required: true,
                                message: 'Email is required',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              disabled={mode !== 'add'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"Email"}
                            />
                          </Form.Item> 

                          

                          <Form.Item
                            label="First Name"
                            name="first_name"
                            
                            rules={[
                              {
                                required: true,
                                message: 'First Name is required',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"First Name"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="Last Name"
                            name="last_name"
                            rules={[
                              {
                                required: true,
                                message: 'First Name is required',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"First Name"}
                            />
                          </Form.Item> 

                          

                          <Form.Item
                            label="Mobile No"
                            name="mobile"
                            rules={[
                              {
                                required: true,
                                message: 'First Name is required',
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"Mobile No"}
                            />
                          </Form.Item> 



                        <Form.Item
                          label="Nationality"
                          name="nationality"
                        >
                          <Select

                          disabled={mode == 'view'}
                          placeholder={mode === 'view' ? "--" :"Select User Type"}
                          
                        >
                          <Select.Option value="Filipino">Filipino</Select.Option>
                          <Select.Option value="Malaysia">Malaysia</Select.Option>
                          <Select.Option value="Thailand">Thailand</Select.Option>
                        </Select>
                      </Form.Item>

                      </div>
                    </Col>
                  </Row>
              </div>
            
            

            {/* Referrer Info */}
            {form.getFieldValue('role') === 'referrer' && (
              <div>
              <Row gutter={16}>
                    <Col span={8}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white">
                        <h1 className="text-2xl font-bold">
                          Referrer Information
                        </h1>
                      </div>
                    </Col>

                    <Col span={16}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white mb-10">
                      <Form.Item
                        name="is_ayala_group_employee"
                        valuePropName="checked"
                      >
                        <Checkbox
                          disabled={mode === 'view'}
                          onChange={e => setIsEmployee(e.target.checked)} // Update state based on checkbox
                        >
                          I'm an Ayala Group Employee
                        </Checkbox>
                      </Form.Item>

                      {isEmployee && ( // Conditional rendering based on isEmployee state
                        <>
                          <Form.Item
                            label="Company"
                            name="company"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'}
                              placeholder={mode === 'view' ? "--" : "Company"}
                            />
                          </Form.Item>

                          <Form.Item
                            label="SBU"
                            name="sbu"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'}
                              placeholder={mode === 'view' ? "--" : "SBU"}
                            />
                          </Form.Item>
   


                            </>
                   )}


                          <Form.Item
                            label="Government ID Type"
                            name="government_id_type"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" :"Government ID Type"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="Government ID Number"
                            name="government_number"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" :"Government ID Number"}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Government ID Expiry"
                            name="government_id_expiry"
                          >
                            <DatePicker
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" : "Select expiry date"}
                              style={{ width: '100%' }}  // Optional: Set width to 100% to fill form item
                            />
                          </Form.Item> 

                         
                          <Form.Item
                            label="TIN"
                            name="tin"

                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" :"TIN"}
                            />
                          </Form.Item>

                      

                          <Form.Item label="Government ID Photo" name="government_id_photo">
                            <Upload {...uploadProps} disabled={mode === 'view'}>
                              {fileList.length >= 1 ? null : (
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                              )}
                            </Upload>
                          </Form.Item>


                      </div>
                    </Col>
                  </Row>
              </div>

            )}

      
                        {/* Broker Info */}
            {form.getFieldValue('role') === 'broker' && (
              <div>
              <Row gutter={16}>
                    <Col span={8}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white">
                        <h1 className="text-2xl font-bold">
                          Broker Information
                        </h1>
                      </div>
                    </Col>

                    <Col span={16}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white mb-10">
                        <Form.Item
                            label="Agency Type"
                            name="agency_type"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"Agency Type"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="Corporation Name"
                            name="corporation_name"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"Corporation Name"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="SEC Registration Number"
                            name="sec_registration_number"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"SEC Registration Number"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="Website"
                            name="website"
                          
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"Website"}
                            />
                          </Form.Item> 

                          <Form.Item
                            label="PRC License Number"
                            name="prc_license_number"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "" :"PRC License Number"}
                            />
                          </Form.Item>

                          <Form.Item label="PRC License Photo" name="prc_photo">
                            <Upload {...uploadProps} disabled={mode === 'view'}>
                              {fileList.length >= 1 ? null : (
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                              )}
                            </Upload>
                          </Form.Item>
                      </div>
                    </Col>
                  </Row>
              </div>
            )}


              {/* Tenant Buyer */}
              {form.getFieldValue('role') === 'tenant_buyer' && (
              <div>
              <Row gutter={16}>
                    <Col span={8}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white">
                        <h1 className="text-2xl font-bold">
                          Tenant Buyer Information
                        </h1>
                      </div>
                    </Col>

                    <Col span={16}>
                      <div className="basic-info-header border border-gray-200 p-4 rounded-lg bg-white mb-10">
                       
                      <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                              <Form.Item
                                label="Bank"
                                name="bank"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Bank"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="Bank Account Number"
                                name="bank_account_number"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Bank Account Number"}
                                />
                              </Form.Item> 
                            </Col>
                        </Row>
                       
                       


                          <Form.Item
                            label="CTC TCT"
                            name="ctc_tct"
                          >
                            <Input
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" :"CTC TCT"}
                            />
                          </Form.Item> 


                          <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                              <Form.Item
                                label="ID Type"
                                name="id_type"
                              
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"ID Type"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="ID Number"
                                name="id_number"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"ID Number"}
                                />
                              </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                              <Form.Item
                                label="ID Expiry Date"
                                name="id_expiry"
                              >
                                <DatePicker
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" : "ID Expiry Date"}
                                  style={{ width: '100%' }}  // Optional: Set width to 100% to fill form item
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item label="ID Photo" name="id_photo">
                                <Upload {...uploadProps} disabled={mode === 'view'}>
                                  {fileList.length >= 1 ? null : (
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                  )}
                                </Upload>
                            </Form.Item>
                            </Col>
                        </Row>

                          <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                              <Form.Item
                                label="No. of Ayala Properties"
                                name="ayala_properties"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"No. of Ayala Properties"}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="No. of Other Properties"
                                name="other_properties"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"No. of Other Properties"}
                                />
                              </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                              <Form.Item
                                label="Payment Terms"
                                name="payment_term"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Payment Terms"}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="TIN"
                                name="tin"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"TIN"}
                                />
                              </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                            <Col span={12}>
                            <Form.Item
                                label="Referrer"
                                name="referrer"
                              >
                                 <Select
                                  disabled={mode === 'view'}
                                  placeholder={mode === 'view' ? "--" :"Select Referrer"}
                     
                                  // onChange={handleRoleChange} // Set the onChange handler
                                ></Select>

                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="Leasing Specialist"
                                name="leasing_specialist"
                              >
                                 <Select
                                  disabled={mode === 'view'}
                                  placeholder={mode === 'view' ? "--" :"Select Leasing Specialist"}
                                  // onChange={handleRoleChange} // Set the onChange handler
                                ></Select>

                              </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Leasing Agent Remarks"
                            name="leasing_agent_remarks"
                            rules={[
                              {
                                required: true,
                                message: 'First Name is required',
                              },
                            ]}
                          >
                            <TextArea
                              type="text"
                              disabled={mode === 'view'} // Disable input in view mode
                              placeholder={mode === 'view' ? "--" :"Leasing Agent Remarks"}
                            />
                          </Form.Item> 

                      </div>
                    </Col>
                  </Row>
              </div>
            )}


            {/* Address */}
              <div>
              <Row gutter={16}>
                    <Col span={8}>
                      <div className="address-info-header border border-gray-200 p-4 rounded-lg bg-white">
                        <h1 className="text-2xl font-bold">
                          Address Information
                        </h1>
                      </div>
                    </Col>

                    <Col span={16}>
                      <div className="address-info-header border border-gray-200 p-4 rounded-lg bg-white mb-10">
                       
                      <Row justify="space-between" align="middle" gutter={[16, 0]} >
                          <Col span={12}>
                              <Form.Item
                                label="Address Type"
                                name="address_type"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Address Type"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="Unit Number"
                                name="unit_number"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Unit Number"}
                                />
                              </Form.Item> 
                            </Col>

                            
                        </Row>
                       
                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                        <Col span={12}>
                              <Form.Item
                                label="Block"
                                name="block"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Block"}
                                />
                              </Form.Item> 
                            </Col>

                          <Col span={12}>
                              <Form.Item
                                label="Lot"
                                name="lot"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Lot"}
                                />
                              </Form.Item> 
                            </Col>

                         
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                        <Col span={12}>
                              <Form.Item
                                label="Street"
                                name="street"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Street"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="Village"
                                name="village"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Village"}
                                />
                              </Form.Item> 
                            </Col>
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                        <Col span={12}>
                              <Form.Item
                                label="Barangay"
                                name="barangay"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Barangay"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label="City"
                                name="city"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"City"}
                                />
                              </Form.Item> 
                            </Col>
                        </Row>

                        <Row justify="space-between" align="middle" gutter={[16, 0]} >
                        <Col span={10}>
                              <Form.Item
                                label="Province"
                                name="province"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Province"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={10}>
                              <Form.Item
                                label="Country"
                                name="country"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Country"}
                                />
                              </Form.Item> 
                            </Col>

                            <Col span={4}>
                              <Form.Item
                                label="Postal Code"
                                name="postal_code"
                              >
                                <Input
                                  type="text"
                                  disabled={mode === 'view'} // Disable input in view mode
                                  placeholder={mode === 'view' ? "--" :"Postal Code"}
                                />
                              </Form.Item> 
                            </Col>
                        </Row>

                      </div>
                    </Col>
                  </Row>
              </div>
                      
                          

             
              

      
            
           


            </Form>

            </Spin>
        </div>
    );
};

export default MemberAddUpdate;
