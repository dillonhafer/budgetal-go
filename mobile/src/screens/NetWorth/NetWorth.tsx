import { monthName } from "@shared/helpers";
import { SplitBackground } from "@src/components/Card";
import GroupList from "@src/components/GroupList";
import { PrimaryButton } from "@src/forms";
import DatePicker from "@src/utils/DatePicker";
import Device from "@src/utils/Device";
import Spin from "@src/utils/Spin";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import { RefreshControl, StatusBar, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { NavigationScreenConfigProps } from "react-navigation";
import MonthCard from "./MonthCard";
import { Asset } from "./types";
import { GetAssets } from "./__generated__/GetAssets";
import { GetNetWorth, GetNetWorthVariables } from "./__generated__/GetNetWorth";
import {
  AssetLiabilityDelete,
  AssetLiabilityDeleteVariables,
} from "./__generated__/AssetLiabilityDelete";
import { notice } from "@src/notify";

const ScreenWidth = Device.width;
const defaultYear = parseInt(`${new Date().getFullYear()}`);

const ASSET_LIABILITY_DELETE = gql`
  mutation AssetLiabilityDelete($id: ID!) {
    assetLiabilityDelete(id: $id) {
      id
      isAsset
      name
    }
  }
`;

const GET_NET_WORTH = gql`
  query GetNetWorth($year: Int!) {
    netWorth(year: $year) {
      id
      month
      netWorthItems {
        id
        amount
        asset {
          id
          name
          isAsset
        }
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
  const [year, setYear] = useState(defaultYear);
  const [refreshing, setRefreshing] = useState(false);
  const { loading: loadingItems, data, refetch } = useQuery<
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
  const loading = loadingItems || loadingAssets;

  const months = data && data.netWorth ? data.netWorth : [];
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
      refetchAssets();
      setRefreshing(false);
    }
  }, [year, refreshing]);

  const carousel = useRef(null);

  const [deleteAsset] = useMutation<
    AssetLiabilityDelete,
    AssetLiabilityDeleteVariables
  >(ASSET_LIABILITY_DELETE, { refetchQueries: ["GetAssets", "GetNetWorth"] });

  return (
    <>
      <StatusBar barStyle="dark-content" animated={true} />
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
        keyExtractor={(i: Asset) => i.id}
        sections={sectionData}
        renderHeader={() => {
          return (
            <View>
              <View style={{ backgroundColor: "#fff", paddingHorizontal: 5 }}>
                <DatePicker
                  year={year}
                  onChange={({ year }) => {
                    navigation.setParams({ year });
                    setYear(year);
                  }}
                />
              </View>
              <SplitBackground>
                <Carousel
                  ref={carousel}
                  data={months}
                  renderItem={({ item }) => {
                    const label = monthName(item.month);
                    return (
                      <MonthCard
                        item={item}
                        onPress={() => {
                          navigation.navigate("MonthListScreen", {
                            month: {
                              ...item,
                              label,
                            },
                            year,
                          });
                        }}
                      />
                    );
                  }}
                  sliderWidth={ScreenWidth}
                  inactiveSlideOpacity={1}
                  inactiveSlideScale={0.9}
                  itemWidth={ScreenWidth - 50}
                  firstItem={new Date().getMonth()}
                />
              </SplitBackground>
            </View>
          );
        }}
        renderSectionFooter={({ section }: { section: { title: string } }) => {
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
        onEdit={(item: Asset) => {
          navigation.navigate("EditAssetLiabilityScreen", {
            item,
          });
        }}
        deleteConfirmation={`⚠️ Are you sure?\nThis will remove all items from past records.\n⛔️ This cannot be undone.`}
        onDelete={(asset: Asset) => {
          const title = asset.isAsset ? "ASSET" : "LIABILITY";
          deleteAsset({ variables: { id: asset.id } }).then(() => {
            notice(`DELETED ${title}`);
          });
        }}
        ListFooterComponent={<Spin spinning={loading && !refreshing} />}
      />

      <Spin spinning={loading && !refreshing} />
    </>
  );
};

export default NetWorthScreen;
