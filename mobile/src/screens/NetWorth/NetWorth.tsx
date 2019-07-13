import React, { PureComponent, useEffect, useState } from "react";
import {
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  View,
} from "react-native";

// Components
import DatePicker from "@src/utils/DatePicker";
import Spin from "@src/utils/Spin";
import moment from "moment";
import GroupList from "@src/components/GroupList";
import { PrimaryButton } from "@src/forms";

import Carousel from "react-native-snap-carousel";
import Card, { SplitBackground } from "@src/components/Card";
import { reduceSum } from "@shared/helpers";
import { groupBy } from "lodash";
import { notice, error } from "@src/notify";
import Device from "@src/utils/Device";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { NavigationScreenConfigProps } from "react-navigation";
import { GetNetWorth, GetNetWorthVariables } from "./__generated__/GetNetWorth";
import { GetAssets } from "./__generated__/GetAssets";

const ScreenWidth = Device.width;
const defaultYear = parseInt(`${new Date().getFullYear()}`);

const GET_NET_WORTH = gql`
  query GetNetWorth($year: Int!) {
    netWorth(year: $year) {
      id
      month
      netWorthItems {
        id
      }
      year
    }
  }
`;

const GET_ASSETS = gql`
  query GetAssets {
    assets {
      id
      isAsset
      name
    }
  }
`;

interface Props extends NavigationScreenConfigProps {}

const NetWorthScreen = ({ navigation }: Props) => {
  // items = month => {
  //   const { true: assets = [], false: liabilities = [] } = groupBy(
  //     month.items,
  //     "isAsset"
  //   );

  //   return { assets, liabilities };
  // };

  // renderCategory = ({ item: month }) => {
  //   const year = this.props.year;
  //   const label = moment.months()[month.month - 1];
  //   const { assets, liabilities } = this.items(month);

  //   const totalAssets = reduceSum(assets);
  //   const totalLiabilities = reduceSum(liabilities);

  //   return (
  //     <View>
  //       <TouchableOpacity
  //         key={month.month}
  //         activeOpacity={0.9}
  //         onPress={() =>
  //           this.props.navigation.navigate("MonthListScreen", {
  //             month: {
  //               ...month,
  //               label,
  //             },
  //             year,
  //           })
  //         }
  //       >
  //         <Card
  //           marginHorizontal={0}
  //           label={`${label} ${month.year}`}
  //           budgeted={totalAssets - totalLiabilities}
  //           spentLabel={"Liabilities"}
  //           spent={totalLiabilities}
  //           remainingLabel={"Assets"}
  //           remaining={totalAssets}
  //           decimal={0}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  // renderCarousel = () => {
  //   const { year } = this.props;
  //   return (
  //     <View
  //       onLayout={event => {
  //         const { width } = event.nativeEvent.layout;
  //         this.setState({ width });
  //       }}
  //     >
  //       <StatusBar barStyle="dark-content" animated={true} />
  //       <View style={{ backgroundColor: "#fff", paddingHorizontal: 5 }}>
  //         <DatePicker
  //           year={year}
  //           onChange={({ year }) => {
  //             navigation.setParams({ year });
  //             setYear(year);
  //           }}
  //         />
  //       </View>
  //       <SplitBackground>
  //         <Carousel
  //           ref={c => {
  //             this._carousel = c;
  //           }}
  //           data={this.props.months}
  //           renderItem={this.renderCategory}
  //           sliderWidth={this.state.width}
  //           inactiveSlideOpacity={1}
  //           inactiveSlideScale={0.9}
  //           itemWidth={this.state.width - 50}
  //           firstItem={new Date().getMonth()}
  //         />
  //       </SplitBackground>
  //     </View>
  //   );
  // };

  // deleteAssetLiability = item => {
  //   this.setState({ loading: true });
  //   const name = item.name.toUpperCase();

  //   this.props
  //     .deleteAssetLiability(item)
  //     .then(() => {
  //       notice(`DELETED ${name}`);
  //     })
  //     .catch(() => {
  //       error(`COULD NOT DELETE ${name}`);
  //     })
  //     .then(() => {
  //       this.setState({ loading: false });
  //     });
  // };

  const [year, setYear] = useState(defaultYear);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery<
    GetNetWorth,
    GetNetWorthVariables
  >(GET_NET_WORTH, {
    variables: { year },
  });

  const {
    loading: loadingAssets,
    data: assetData,
    refetch: refetchAssets,
  } = useQuery<GetAssets>(GET_ASSETS);

  const assets = assetData && assetData.assets ? assetData.assets : [];
  const sectionData = [
    {
      title: "ASSETS",
      color: "transparent",
      data: assets.filter(a => a.isAsset),
    },
    {
      title: "LIABILITIES",
      color: "transparent",
      data: assets.filter(a => !a.isAsset),
    },
  ];

  useEffect(() => {
    if (refreshing) {
      refetch({ year });
      setRefreshing(false);
    }
  }, [year, refreshing]);

  return (
    <>
      <GroupList
        refreshControl={
          <RefreshControl
            tintColor={"lightskyblue"}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
        keyExtractor={i => i.id}
        sections={sectionData}
        renderHeader={() => {
          return null;
          // this.renderCarousel
        }}
        renderSectionFooter={({ section }) => {
          const title = section.title === "ASSETS" ? "ASSET" : "LIABILITY";
          return (
            <PrimaryButton
              title={`ADD ${title}`}
              onPress={() => {
                navigation.navigate("NewAssetLiabilityScreen", {
                  section,
                  title,
                });
              }}
            />
          );
        }}
        onEdit={item => {
          navigation.navigate("EditAssetLiabilityScreen", {
            item,
          });
        }}
        deleteConfirmation={`⚠️ Are you sure?\nThis will remove all items from past records.\n⛔️ This cannot be undone.`}
        onDelete={() => {
          // this.deleteAssetLiability
        }}
        ListFooterComponent={<Spin spinning={loading && !refreshing} />}
      />

      <Spin spinning={loading && !refreshing} />
    </>
  );
};

export default NetWorthScreen;
