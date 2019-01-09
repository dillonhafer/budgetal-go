import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Helpers
import { Bold, Medium } from 'components/Text';
import { currencyf } from '@shared/helpers';
import { colors } from '@shared/theme';
import { confirm } from 'notify';

export const positions = {
  first: 'first',
  last: 'last',
  only: 'only',
  middle: 'middle',
};

class ListItem extends PureComponent {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    deleteConfirmation: PropTypes.string,
    position: PropTypes.oneOf(Object.keys(positions)).isRequired,
  };

  confirmDelete = () => {
    confirm({
      title: `Delete ${this.props.label}?`,
      okText: 'Delete',
      content: this.props.deleteConfirmation,
      onOk: this.props.onDelete,
    });
  };

  render() {
    const { label, position, active, color = colors.error } = this.props;
    const borderRadiusStyles = {
      first: styles.firstRow,
      last: styles.lastRow,
      only: styles.onlyRow,
    }[position];

    const amount = this.props.amount.startsWith('$')
      ? this.props.amount
      : currencyf(this.props.amount);

    return (
      <View style={[styles.expenseRowContainer, borderRadiusStyles]}>
        <View style={styles.expenseRow}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={this.props.onToggle}>
              <MaterialCommunityIcons
                name="dots-horizontal-circle"
                size={22}
                style={styles.expenseOptionsIcon}
              />
            </TouchableOpacity>
            <Bold style={styles.expenseText}>{label}</Bold>
          </View>
          <Bold style={[styles.amount, { color }]}>{amount}</Bold>
        </View>
        {active && (
          <View style={styles.crudRow}>
            <TouchableOpacity
              onPress={this.props.onEdit}
              style={{
                flex: 1,
              }}
            >
              <View style={styles.buttonRow}>
                <MaterialCommunityIcons
                  name="pencil"
                  color={colors.primary}
                  size={20}
                  style={{ marginRight: 5 }}
                />
                <Medium style={{ color: colors.primary }}>EDIT</Medium>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.confirmDelete}
              style={{
                flex: 1,
              }}
            >
              <View style={styles.buttonRow}>
                <MaterialCommunityIcons
                  name="delete"
                  color={colors.error}
                  size={20}
                  style={{ marginRight: 5 }}
                />
                <Medium style={{ color: colors.error }}>DELETE</Medium>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  expenseRowContainer: {
    flex: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 10,
    paddingVertical: 15,
  },
  expenseRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstRow: {
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  lastRow: {
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  onlyRow: {
    borderRadius: 9,
  },
  expenseOptionsIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    marginRight: 5,
    color: '#aaa',
  },
  expenseText: {
    fontWeight: 'bold',
  },
  amount: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 16,
  },
  crudRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListItem;
