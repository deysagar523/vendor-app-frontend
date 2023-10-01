import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import axios from "axios";
import { Alert } from "@mui/material";

const CreateVendor = () => {
  const [form] = Form.useForm();
  const REACT_APP_BACKEND_ROUTE_URL = process.env.REACT_APP_BACKEND_ROUTE_URL;
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const onFinish = async (values) => {
    try {
      const response = await axios.post(REACT_APP_BACKEND_ROUTE_URL, values);
      // Handle success, e.g., show a success message or redirect
  
      if (response.status === 201) {
        // The user/vendor was successfully created
        console.log("Vendor created successfully!");
        form.resetFields();
        setIsSuccessAlertVisible(true); // Show the success alert
  
        // Automatically hide the success alert after 2 seconds (2000 milliseconds)
        setTimeout(() => {
          setIsSuccessAlertVisible(false);
        }, 2000);
      } else {
        // Handle other success cases or unexpected status codes
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      // Handle error, e.g., display an error message
      console.error("Error creating vendor:", error);
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  const validateBankAccountNo = (_, value) => {
    // Implement your bank account number validation logic here
    if (!value || value.length < 10) {
      return Promise.reject("Bank Account No. must be at least 10 characters");
    }
    return Promise.resolve();
  };

  return (
    <Row justify="center">
      <Col span={12}>
        <h2>Create Vendor</h2>

        {/* Success Alert */}
        {isSuccessAlertVisible && (
          <Alert
            severity="success"
            onClose={() => setIsSuccessAlertVisible(false)}
          >
            Vendor created successfully!
          </Alert>
        )}

        <Form
          form={form}
          name="createVendorForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="vendorName"
            label="Vendor Name"
            rules={[
              { required: true, message: "Vendor Name is required" },
              { max: 100, message: "Vendor Name cannot exceed 100 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bankAccountNo"
            label="Bank Account No."
            rules={[
              { required: true, message: "Bank Account No. is required" },
              { validator: validateBankAccountNo },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[
              { required: true, message: "Bank Name is required" },
              { max: 100, message: "Bank Name cannot exceed 100 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="addressLine1"
            label="Address Line 1"
            rules={[
              {
                max: 100,
                message: "Address Line 1 cannot exceed 100 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="addressLine2"
            label="Address Line 2"
            rules={[
              {
                max: 100,
                message: "Address Line 2 cannot exceed 100 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ max: 50, message: "City cannot exceed 50 characters" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[
              { max: 50, message: "Country cannot exceed 50 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[
              { max: 10, message: "Zip Code cannot exceed 10 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ display: "block", margin: "0 auto" }} // Center align the button
            >
              Create Vendor
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default CreateVendor;
