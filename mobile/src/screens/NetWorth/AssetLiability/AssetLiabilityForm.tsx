import { FieldContainer, PrimaryButton, DangerButton } from "@src/forms";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { TextInput, View } from "react-native";
import { BudgetItemInput } from "__generated__/globalTypes";
import {
  AssetLiabilityUpsert,
  AssetLiabilityUpsertVariables,
} from "./__generated__/AssetLiabilityUpsert";
import InsetScrollView from "@src/components/InsetScrollView";
import { GetAssets } from "../__generated__/GetAssets";
import { Asset } from "../types";

const GET_ASSETS = gql`
  query GetAssets {
    assets {
      id
      isAsset
      name
    }
  }
`;

const ASSET_LIABILITY_UPSERT = gql`
  mutation AssetLiabilityUpsert($id: ID, $isAsset: Boolean!, $name: String!) {
    assetLiabilityUpsert(id: $id, isAsset: $isAsset, name: $name) {
      id
      isAsset
      name
    }
  }
`;

interface Props {
  asset: Asset;
  afterSubmit(): void;
  onCancel(): void;
}

const AssetLiabilityForm = ({ asset, afterSubmit, onCancel }: Props) => {
  const [name, setName] = useState(asset.name);

  const [assetLiabilityUpsert, { loading }] = useMutation<
    AssetLiabilityUpsert,
    AssetLiabilityUpsertVariables
  >(ASSET_LIABILITY_UPSERT, {
    variables: {
      id: asset.id,
      isAsset: asset.isAsset,
      name,
    },
    refetchQueries: ["GetAssets"],
  });

  const { data: assetData } = useQuery<GetAssets>(GET_ASSETS);

  const assets = assetData && assetData.assets ? assetData.assets : [];
  const valid =
    name.length > 0 &&
    !assets
      .filter(a => a.id !== asset.id)
      .map(a => a.name.trim().toLowerCase())
      .includes(name.trim().toLowerCase());

  const onDone = () => {
    if (valid) {
      assetLiabilityUpsert().then(() => afterSubmit());
    }
  };

  return (
    <InsetScrollView>
      <>
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            placeholder="Name"
            defaultValue={name}
            autoFocus
            enablesReturnKeyAutomatically
            underlineColorAndroid={"transparent"}
            returnKeyType="done"
            onChangeText={setName}
            onSubmitEditing={onDone}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title="Save"
          disabled={!valid}
          onPress={onDone}
          loading={!valid || loading}
        />

        <DangerButton title="Cancel" onPress={onCancel} />
      </>
    </InsetScrollView>
  );
};

export default AssetLiabilityForm;
