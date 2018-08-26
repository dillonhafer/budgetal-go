import React, { PureComponent } from 'react';
import { TouchableOpacity, StatusBar, View, Dimensions } from 'react-native';

// Components
import DatePicker from 'utils/DatePicker';
import Spin from 'utils/Spin';
import moment from 'moment';
import GroupList from 'components/GroupList';
import { PrimaryButton } from 'forms';

import Carousel from 'react-native-snap-carousel';
import Card, { SplitBackground } from 'components/Card';
import { reduceSum } from 'utils/helpers';
import { groupBy } from 'lodash';

const { width: ScreenWidth } = Dimensions.get('window');

class NetWorthScreen extends PureComponent {
  state = {
    width: ScreenWidth,
  };

  componentDidMount() {
    this.loadNetWorthItems({ year: new Date().getFullYear() });
  }

  loadNetWorthItems = ({ year }) => {
    this.props.loadNetWorthItems({ year });
  };

  items = month => {
    const { true: assets = [], false: liabilities = [] } = groupBy(
      month.items,
      'isAsset',
    );

    return { assets, liabilities };
  };

  renderCategory = ({ item: month }) => {
    const year = this.props.year;
    const label = moment.months()[month.month - 1];
    const { assets, liabilities } = this.items(month);

    const totalAssets = reduceSum(assets);
    const totalLiabilities = reduceSum(liabilities);

    return (
      <View>
        <TouchableOpacity
          key={month.month}
          activeOpacity={0.9}
          onPress={() =>
            this.props.screenProps.layoutNavigate('MonthListScreen', {
              month: {
                ...month,
                label,
              },
              year,
            })
          }
        >
          <Card
            marginHorizontal={0}
            label={`${label} ${month.year}`}
            budgeted={totalAssets - totalLiabilities}
            spentLabel={'Liabilities'}
            spent={totalLiabilities}
            remainingLabel={'Assets'}
            remaining={totalAssets}
            decimal={0}
          />
        </TouchableOpacity>
      </View>
    );
  };

  onDateChange = ({ year }) => {
    if (String(year) !== String(this.props.year)) {
      this.loadNetWorthItems({ year });
    }
  };

  renderCarousel = () => {
    const { year } = this.props;
    return (
      <View
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          this.setState({ width });
        }}
      >
        <StatusBar barStyle="dark-content" animated={true} />
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
          <DatePicker year={year} onChange={this.onDateChange} />
        </View>
        <SplitBackground>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.props.months}
            renderItem={this.renderCategory}
            sliderWidth={this.state.width}
            inactiveSlideOpacity={1}
            inactiveSlideScale={0.9}
            itemWidth={this.state.width - 50}
            firstItem={new Date().getMonth()}
          />
        </SplitBackground>
      </View>
    );
  };

  renderSectionFooter = ({ section }) => {
    const title = section.title === 'ASSETS' ? 'ASSET' : 'LIABILITY';
    return (
      <PrimaryButton
        title={`ADD ${title}`}
        onPress={() => {
          this.props.screenProps.layoutNavigate('NewAssetLiabilityScreen', {
            section,
            title,
          });
        }}
      />
    );
  };

  render() {
    const { refreshing, loading } = this.props;
    const sectionData = [
      {
        title: 'ASSETS',
        color: 'transparent',
        data: this.props.assets,
      },
      {
        title: 'LIABILITIES',
        color: 'transparent',
        data: this.props.liabilities,
      },
    ];

    return (
      <GroupList
        keyExtractor={i => i.id}
        sections={sectionData}
        renderHeader={this.renderCarousel}
        renderSectionFooter={this.renderSectionFooter}
        onEdit={item => {
          this.props.screenProps.layoutNavigate('EditAssetLiabilityScreen', {
            item,
          });
        }}
        deleteConfirmation={`⚠️ Are you sure?\nThis will remove all items from past records.\n⛔️ This cannot be undone.`}
        onDelete={item => {
          this.props.deleteAssetLiability(item);
        }}
        ListFooterComponent={<Spin spinning={loading && !refreshing} />}
      />
    );
  }
}

export default NetWorthScreen;
