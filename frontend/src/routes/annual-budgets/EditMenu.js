import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { updatedSelectedItem, removeItem } from 'actions/annual-budget-items';

import { DeleteAnnualBudgetItemRequest } from 'api/annual-budget-items';
import moment from 'moment';
import { notice } from 'window';
import ProgressModal from './ProgressModal';

// Antd
import { Menu, Icon, Modal, Button, Dropdown } from 'antd';
const Item = Menu.Item;

class EditMenu extends Component {
  state = {
    showProgress: false,
  };

  handleProgress = () => {
    this.setState({
      showProgress: true,
    });
  };

  hideProgress = () => {
    this.setState({
      showProgress: false,
    });
  };

  handleEdit = () => {
    const { item } = this.props;
    const i = { ...item, dueDate: moment(item.dueDate) };
    this.props.updatedSelectedItem(i);
  };

  handleDelete = () => {
    Modal.confirm({
      title: `Are you sure you want to delete ${this.props.item.name}?`,
      content: 'This cannot be undone',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: this.deleteItem,
    });
  };

  deleteItem = async () => {
    const { item } = this.props;
    const resp = await DeleteAnnualBudgetItemRequest(item);
    if (resp && resp.ok) {
      notice(`Deleted ${item.name}`);
      this.props.removeItem(item);
    }
  };

  render() {
    const overlay = (
      <Menu>
        <Item>
          <a className="primary-color" onClick={this.handleProgress}>
            <Icon type="area-chart" /> Progress
          </a>
        </Item>
        <Item>
          <a className="primary-color" onClick={this.handleEdit}>
            <Icon type="edit" /> Edit
          </a>
        </Item>
        <Item>
          <a className="alert-color" onClick={this.handleDelete}>
            <Icon type="delete" /> Delete
          </a>
        </Item>
      </Menu>
    );

    return (
      <div className="annual-item-crud">
        <Dropdown overlay={overlay} trigger={['click']}>
          <Button type="ghost" shape="circle" icon="ellipsis" />
        </Dropdown>
        <ProgressModal
          item={this.props.item}
          hideProgress={this.hideProgress}
          visible={this.state.showProgress}
        />
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    updatedSelectedItem: selectedBudgetItem => {
      dispatch(updatedSelectedItem(selectedBudgetItem));
    },
    removeItem: item => {
      dispatch(removeItem(item));
    },
  }),
)(EditMenu);
