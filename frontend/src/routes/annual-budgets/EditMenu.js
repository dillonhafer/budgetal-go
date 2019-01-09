import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { updatedSelectedItem, removeItem } from 'actions/annual-budget-items';

import { DeleteAnnualBudgetItemRequest } from '@shared/api/annual-budget-items';
import moment from 'moment';
import { notice } from 'window';
import ProgressModal from './ProgressModal';

import {
  Dialog,
  Alert,
  Text,
  Menu,
  Popover,
  Position,
  IconButton,
} from 'evergreen-ui';

class EditMenu extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    updatedSelectedItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
  };

  state = {
    showDeleteConfirmation: false,
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
    const i = { ...item, dueDate: moment(item.dueDate).format('YYYY-MM-DD') };
    this.props.updatedSelectedItem(i);
  };

  handleDelete = () => {
    this.setState({ showDeleteConfirmation: true });
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
        <Menu.Group>
          <Menu.Item onSelect={this.handleProgress} icon="chart">
            Progress
          </Menu.Item>
          <Menu.Item onSelect={this.handleEdit} icon="edit">
            Edit
          </Menu.Item>
        </Menu.Group>
        <Menu.Divider />
        <Menu.Group>
          <Menu.Item onSelect={this.handleDelete} icon="trash" intent="danger">
            Delete
          </Menu.Item>
        </Menu.Group>
      </Menu>
    );

    return (
      <div>
        <Popover position={Position.BOTTOM_LEFT} content={overlay}>
          <IconButton icon="more" />
        </Popover>
        <ProgressModal
          item={this.props.item}
          hideProgress={this.hideProgress}
          visible={this.state.showProgress}
        />
        <Dialog
          width={450}
          intent="danger"
          hasHeader={false}
          confirmLabel={`Delete`}
          onConfirm={this.deleteItem}
          onCloseComplete={() => {
            this.setState({ showDeleteConfirmation: false });
          }}
          isShown={this.state.showDeleteConfirmation}
        >
          <Alert
            intent="danger"
            title={`Are you sure you want to delete ${this.props.item.name}?`}
          >
            <Text>This cannot be undone</Text>
          </Alert>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    updatedSelectedItem: selectedBudgetItem => {
      dispatch(updatedSelectedItem(selectedBudgetItem));
    },
    removeItem: item => {
      dispatch(removeItem(item));
    },
  }),
)(EditMenu);
