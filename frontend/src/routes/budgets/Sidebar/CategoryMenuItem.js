import React, { Component } from 'react';
import { Icon, Pane, Text } from 'evergreen-ui';
import { colors } from '@shared/theme';
import './category-menu-item.css';

class CategoryMenuItem extends Component {
  render() {
    const { category, isSelected, isComplete = false, onSelect } = this.props;
    const itemClass = category.name.toLowerCase().replace('/', '-');
    const backgroundColor = isSelected ? 'rgba(67, 90, 111, 0.04)' : 'none';
    const borderRight = isSelected
      ? `2px solid ${colors.primary}`
      : '2px solid transparent';
    const icon = isComplete ? 'endorsed' : 'blank';
    return (
      <Pane
        cursor="pointer"
        className="menu-item"
        role="menuitem"
        data-isselectable="true"
        height={40}
        display="flex"
        flexDirection="row"
        alignItems="center"
        backgroundColor={backgroundColor}
        borderRight={borderRight}
        onClick={() => {
          onSelect(category);
        }}
      >
        <Pane
          height={16}
          width={16}
          marginLeft={16}
          marginRight={-4}
          className={itemClass}
        />
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          flex="1"
        >
          <Text marginLeft={16} fontSize={14} fontWeight={400}>
            {category.name}
          </Text>
          <Icon color={colors.success} marginRight={10} icon={icon} />
        </Pane>
      </Pane>
    );
  }
}

export default CategoryMenuItem;
