import { monthName, reduceSum } from "@shared/helpers";
import Card from "@src/components/Card";
import isEqual from "fast-deep-equal";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { GetNetWorth_netWorth } from "./__generated__/GetNetWorth";

interface Props {
  onPress(): void;
  item: GetNetWorth_netWorth;
}

const MonthCard = ({ item: month, onPress }: Props) => {
  const label = monthName(month.month);
  const assets = month.netWorthItems.filter(i => i.asset.isAsset);
  const liabilities = month.netWorthItems.filter(i => !i.asset.isAsset);
  const totalAssets = reduceSum(assets);
  const totalLiabilities = reduceSum(liabilities);

  return (
    <View>
      <TouchableOpacity key={month.month} activeOpacity={0.9} onPress={onPress}>
        <Card
          marginHorizontal={0}
          label={`${label} ${month.year}`}
          budgeted={totalAssets - totalLiabilities}
          spentLabel={"Liabilities"}
          spent={totalLiabilities}
          remainingLabel={"Assets"}
          remaining={totalAssets}
          decimal={0}
        />
      </TouchableOpacity>
    </View>
  );
};

const shouldSkipUpdate = (prev: Props, next: Props) =>
  isEqual(prev.item, next.item);

export default React.memo(MonthCard, shouldSkipUpdate);
