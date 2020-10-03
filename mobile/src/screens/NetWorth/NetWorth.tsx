import GroupList from "@src/components/GroupList";
import { PrimaryButton } from "@src/forms";
import { notice } from "@src/notify";
import gql from "graphql-tag";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMutation, useQuery } from "react-apollo";
import { RefreshControl, StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import { Asset } from "./types";
import {
	AssetLiabilityDelete,
	AssetLiabilityDeleteVariables,
} from "./__generated__/AssetLiabilityDelete";
import { GetAssets } from "./__generated__/GetAssets";
import Device from "@src/utils/Device";
import styled from "styled-components/native";
import DatePicker from "@src/utils/DatePicker";
import {
	GetNetWorth,
	GetNetWorthVariables,
	GetNetWorth_netWorth,
} from "./__generated__/GetNetWorth";
import { monthName } from "@shared/helpers";
import { SplitBackground } from "@src/components/Card";
import Carousel from "react-native-snap-carousel";
import MonthCard from "./MonthCard";

const defaultYear = parseInt(`${new Date().getFullYear()}`);
const emptyMonths: GetNetWorth_netWorth[] = [];
for (let i = 1; i < 13; i++) {
	emptyMonths.push({
		__typename: "NetWorth",
		id: `${defaultYear}-${i}`,
		month: i,
		year: defaultYear,
		netWorthItems: [],
	});
}

const DatePickerContainer = styled.View({
	backgroundColor: "white",
	paddingHorizontal: 5,
});
const ScreenWidth = Device.width;
const ItemWidth = ScreenWidth - 50;

const deleteConfirmation = `⚠️ Are you sure?\nThis will remove all items from past records.\n⛔️ This cannot be undone.`;
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
const initialIndex = new Date().getMonth();

interface HeaderProps {
	onDateChange: ({ year }: { year: number }) => void;
	onPress: (item: GetNetWorth_netWorth) => void;
	items: GetNetWorth_netWorth[];
}

const HeaderComponent = ({ onDateChange, items, onPress }: HeaderProps) => {
	const carousel = useRef(null);
	return (
		<>
			<DatePickerContainer>
				<DatePicker year={defaultYear} onChange={onDateChange} />
			</DatePickerContainer>
			<SplitBackground>
				<Carousel
					ref={carousel}
					data={items}
					shouldOptimizeUpdates
					initialNumToRender={12}
					sliderWidth={ScreenWidth}
					itemWidth={ItemWidth}
					firstItem={initialIndex}
					renderItem={({ item }: { item: GetNetWorth_netWorth }) => (
						<MonthCard item={item} onPress={() => onPress(item)} />
					)}
				/>
			</SplitBackground>
		</>
	);
};

interface Props extends NavigationScreenConfigProps {}
const NetWorthScreen = ({ navigation }: Props) => {
	const [refreshing, setRefreshing] = useState(false);
	const { data: assetData, refetch: refetchAssets } = useQuery<GetAssets>(
		GET_ASSETS
	);
	const assetsAndLiabilities =
		assetData && assetData.assets ? assetData.assets : [];
	const assets = assetsAndLiabilities.filter(a => a.isAsset);
	const liabilities = assetsAndLiabilities.filter(a => !a.isAsset);

	const sectionData = [
		{
			title: "ASSETS",
			color: "transparent",
			data: assets,
		},
		{
			title: "LIABILITIES",
			color: "transparent",
			data: liabilities,
		},
	];

	useEffect(() => {
		if (refreshing) {
			refetchAssets();
			setRefreshing(false);
		}
	}, [refreshing]);

	const [deleteAsset] = useMutation<
		AssetLiabilityDelete,
		AssetLiabilityDeleteVariables
	>(ASSET_LIABILITY_DELETE, { refetchQueries: ["GetAssets", "GetNetWorth"] });

	const { data, refetch } = useQuery<GetNetWorth, GetNetWorthVariables>(
		GET_NET_WORTH,
		{
			variables: { year: defaultYear },
		}
	);

	const emptyData: GetNetWorth_netWorth[] = [];
	let items = emptyData;
	if (data && data.netWorth) {
		items = data.netWorth;
	}

	const onPress = (item: GetNetWorth_netWorth) => {
		const label = monthName(item.month);
		navigation.navigate("MonthListScreen", {
			month: {
				...item,
				label,
			},
			assets,
			liabilities,
			year: item.year,
		});
	};

	const onDateChange = ({ year }: { year: number }) => {
		refetch({ year });
	};

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
				renderHeader={
					<HeaderComponent
						items={items}
						onPress={onPress}
						onDateChange={onDateChange}
					/>
				}
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
				deleteConfirmation={deleteConfirmation}
				onDelete={(asset: Asset) => {
					const title = asset.isAsset ? "ASSET" : "LIABILITY";
					deleteAsset({ variables: { id: asset.id } }).then(() => {
						notice(`DELETED ${title}`);
					});
				}}
			/>
		</>
	);
};

export default NetWorthScreen;
