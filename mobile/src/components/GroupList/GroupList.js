import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar, SectionList, StyleSheet } from 'react-native';
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import ListBackgroundFill from 'components/ListBackgroundFill';
import { currencyf } from 'utils/helpers';
import ListItem, { positions } from './ListItem';
import { Bold } from 'components/Text';

class GroupList extends Component {
  static propTypes = {
    refreshControl: PropTypes.any,
    renderHeader: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderSectionFooter: PropTypes.func,
    renderEmptyComponent: PropTypes.func,
    keyExtractor: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    deleteConfirmation: PropTypes.string,
    stickySectionHeadersEnabled: PropTypes.bool,
    sections: PropTypes.array,
    inset: PropTypes.bool,
  };

  state = {
    visibleRowId: null,
  };

  toggleVisibleExpense = rowId => {
    this.setState({
      visibleRowId: rowId === this.state.visibleRowId ? null : rowId,
    });
  };

  getPosition = (index, length) => {
    let position = positions.middle;

    if (index === 0) {
      position = positions.first;
    }
    if (length - 1 === index) {
      position = positions.last;
    }
    if (length === 1) {
      position = positions.only;
    }
    return position;
  };

  renderItem = ({ item, index, section }) => {
    const position = this.getPosition(index, section.data.length);
    const rowId = `${Object.values(section)}${index}`;
    const active = this.state.visibleRowId === rowId;
    return (
      <ListItem
        label={item.name}
        amount={currencyf(item.amount, '$', 0)}
        active={active}
        color={section.color}
        position={position}
        onDelete={() => this.props.onDelete(item)}
        deleteConfirmation={this.props.deleteConfirmation}
        onEdit={() => this.props.onEdit(item)}
        onToggle={() => this.toggleVisibleExpense(rowId)}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Bold style={styles.headerText}>{section.title.toUpperCase()}</Bold>
      </View>
    );
  };

  render() {
    const { stickySectionHeadersEnabled = false } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ListBackgroundFill />
        <SectionList
          {...BlurViewInsetProps}
          refreshControl={this.props.refreshControl}
          extraData={this.state.visibleRowId}
          ListHeaderComponent={this.props.renderHeader}
          style={styles.list}
          contentContainerStyle={styles.contentStyles}
          stickySectionHeadersEnabled={stickySectionHeadersEnabled}
          keyExtractor={this.props.keyExtractor}
          sections={this.props.sections}
          renderSectionHeader={
            this.props.renderSectionHeader || this.renderSectionHeader
          }
          renderSectionFooter={this.props.renderSectionFooter}
          ListEmptyComponent={this.props.renderEmptyComponent}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: {
    alignSelf: 'stretch',
  },
  contentStyles: {
    backgroundColor: '#d8dce0',
    minHeight: '100%',
    paddingBottom: 10,
  },
  header: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'transparent',
    paddingVertical: 5,
  },
  headerText: {
    color: '#555',
    fontWeight: 'bold',
  },
});

export default GroupList;
