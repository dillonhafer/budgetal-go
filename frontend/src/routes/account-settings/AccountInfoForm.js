import React from 'react';
import { notice, error } from 'window';
import { UpdateAccountInfoRequest } from 'api/users';
import { GetCurrentUser } from 'authentication';
import { get, round, assign } from 'lodash';
import { Button, Col, Form, Icon, Input, Modal, Row, Upload } from 'antd';
import { SetCurrentUser } from 'authentication';

class AccountInfoForm extends React.Component {
  constructor(props) {
    super(props);
    const user = GetCurrentUser();
    this.state = {
      user,
      loading: false,
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: -1,
          name: '',
          status: 'done',
          url: user.avatarUrl,
        },
      ],
    };
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({ previewVisible: false, confirmPasswordVisible: false });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = p => {
    this.setState({ fileList: p.fileList });
  };

  update = e => {
    const user = Object.assign({}, this.state.user, {
      [e.target.id]: e.target.value,
    });
    this.setState({ user });
  };

  save = async values => {
    let data = new FormData();
    data.append('firstName', values.firstName);
    data.append('lastName', values.lastName);
    data.append('email', values.email);
    data.append('password', values.current_password);
    if (this.state.file) {
      data.append('avatar', this.state.file);
    }

    const resp = await UpdateAccountInfoRequest(data);
    if (resp && resp.ok) {
      notice('Account Updated');
      SetCurrentUser(resp.user);
    }
    return resp;
  };

  handleFile = file => {
    this.setState({ file });
    const reader = new FileReader();
    const mbLimit = 5;

    if (round(file.size / 1048576, 2) > mbLimit) {
      error(`Your photo is too large. The limit is ${mbLimit} MB`);
    } else {
      reader.onload = upload => {
        const user = assign({}, this.state.user, {
          avatar: upload.target.result,
        });
        const fileList = [
          {
            uid: -1,
            name: file.name,
            status: 'done',
            url: user.avatar,
          },
        ];
        this.setState({ user, fileList });
      };

      reader.readAsDataURL(file);
    }
  };

  handleOnOk = e => {
    if (e) e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      try {
        this.setState({ loading: true });
        if (!err) {
          const r = await this.save(values);
          if (r.ok) {
            this.handleCancel();
          }
        } else {
          error('Please check form for errors');
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.setState({ loading: false });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ confirmPasswordVisible: true });
  };

  uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = get({ 0: this.uploadButton }, fileList.length, null);
    const user = this.state.user;
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <div className="body-row account-settings clearfix">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Col md={8} xs={24} sm={24} className="text-center">
              <div style={{ textAlign: 'center' }}>
                <Upload
                  action="/"
                  accept="image/*"
                  beforeUpload={file => {
                    this.handleFile(file);
                    return false;
                  }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {uploadButton}
                </Upload>
              </div>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img
                  alt="avatar"
                  style={{ width: '100%' }}
                  onError={e => {
                    e.target.src = '/missing-profile.png';
                  }}
                  src={previewImage}
                />
              </Modal>
            </Col>
            <Col md={16}>
              <Form.Item
                {...this.formItemLayout}
                label="First Name"
                hasFeedback
              >
                {getFieldDecorator('firstName', {
                  initialValue: user.firstName,
                  onChange: this.update,
                  rules: [
                    {
                      required: true,
                      message: 'First Name is required',
                    },
                  ],
                })(
                  <Input
                    autoComplete="given-name"
                    addonBefore={<Icon type="user" />}
                  />,
                )}
              </Form.Item>
              <Form.Item {...this.formItemLayout} label="Last Name" hasFeedback>
                {getFieldDecorator('lastName', {
                  initialValue: user.lastName,
                  onChange: this.update,
                  rules: [
                    {
                      required: true,
                      message: 'Last Name is required',
                    },
                  ],
                })(
                  <Input
                    autoComplete="family-name"
                    addonBefore={<Icon type="user" />}
                  />,
                )}
              </Form.Item>
              <Form.Item {...this.formItemLayout} label="Email" hasFeedback>
                {getFieldDecorator('email', {
                  initialValue: user.email,
                  onChange: this.update,
                  rules: [
                    {
                      type: 'email',
                      message: 'That does not look like a valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'E-mail is required',
                    },
                  ],
                })(
                  <Input
                    autoComplete="username"
                    addonBefore={<Icon type="mail" />}
                    type="email"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <div className="text-right">
                  <Button type="primary" htmlType="submit" size="large">
                    Update Account Info
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Form>
          <Modal
            width="300px"
            title="Confirm Password To Continue"
            confirmLoading={this.state.loading}
            visible={this.state.confirmPasswordVisible}
            onOk={this.handleOnOk}
            okText="Confirm Password"
            onCancel={this.handleCancel}
          >
            <Form onSubmit={this.handleOnOk}>
              <Form.Item label="Password" hasFeedback>
                {this.props.form.getFieldDecorator('current_password', {
                  onChange: this.update,
                  rules: [
                    {
                      required: true,
                      message: 'Current Password is required',
                    },
                  ],
                })(
                  <Input
                    autoComplete="current-password"
                    addonBefore={<Icon type="lock" />}
                    type="password"
                  />,
                )}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Row>
    );
  }
}

export default Form.create()(AccountInfoForm);
