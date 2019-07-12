import React, { Component } from 'react';
import { View } from 'react-native';
import GroupList from '@src/components/GroupList';

class AssetManagementScreen extends Component {
  render() {
    const type = this.props.navigation.getParam('type', '???').toLowerCase();
    const sectionData = [{ title: '', data: this.props[type] }];

    return (
      <GroupList
        keyExtractor={i => i.id}
        sections={sectionData}
        renderSectionHeader={() => <View style={{ height: 50 }} />}
        onEdit={item => {
          this.props.navigation.navigate('EditMonthItemScreen', {
            item,
          });
        }}
        onDelete={this.deleteItem}
      />
    );
  }
}

export default AssetManagementScreen;
