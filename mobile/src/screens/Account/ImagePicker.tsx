import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ExpoImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React from "react";
import { StatusBar } from "react-native";
import Modal from "react-native-modalbox";
import styled from "styled-components/native";

const CancelButton = styled.TouchableOpacity({
  padding: 20,
  width: "100%",
});

const CancelText = styled.Text({
  textAlign: "center",
  color: "#fff",
});

const ModalButtonText = styled.Text({
  color: "#fff",
  fontSize: 20,
});

const ModalButton = styled.TouchableOpacity({
  borderWidth: 4,
  borderColor: "#fff",
  borderRadius: 10,
  padding: 30,
  margin: 30,
  width: 200,
  height: 200,
  alignItems: "center",
  justifyContent: "center",
});

const ButtonIcon = styled(MaterialCommunityIcons).attrs<{
  name: "folder-multiple-image" | "camera";
}>(({ name }) => ({
  name,
  size: 80,
  color: "#fff",
}))({});

const Blur = styled(BlurView).attrs({
  tint: "dark",
  intensity: 95,
})({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const imageOptions = {
  allowsEditing: true,
  aspect: [4, 3] as [number, number],
  exif: false,
};

interface Props {
  visible: boolean;
  onCancel(): void;
  onChange(result: ExpoImagePicker.ImagePickerResult): void;
}

const ImagePicker = ({ visible, onChange, onCancel }: Props) => {
  return (
    <Modal
      style={{
        backgroundColor: "transparent",
      }}
      coverScreen={true}
      isOpen={visible}
      backdrop={false}
      backButtonClose={true}
      onClosed={() => {
        onCancel();
      }}
    >
      <Blur>
        <ModalButton
          onPress={async () => {
            const { status: cam } = await Permissions.askAsync(
              Permissions.CAMERA
            );
            const { status: roll } = await Permissions.askAsync(
              Permissions.CAMERA_ROLL
            );

            if (cam === "granted" && roll === "granted") {
              ExpoImagePicker.launchCameraAsync(imageOptions).then(onChange);
            }
          }}
        >
          <ButtonIcon name="camera" />
          <ModalButtonText>Camera</ModalButtonText>
        </ModalButton>

        <ModalButton
          onPress={() => {
            Permissions.askAsync(Permissions.CAMERA_ROLL).then(({ status }) => {
              if (status === "granted") {
                StatusBar.setBarStyle("dark-content", true);
                ExpoImagePicker.launchImageLibraryAsync(imageOptions).then(
                  onChange
                );
              }
            });
          }}
        >
          <ButtonIcon name="folder-multiple-image" />
          <ModalButtonText>Photos</ModalButtonText>
        </ModalButton>
        <CancelButton onPress={onCancel}>
          <CancelText>Cancel</CancelText>
        </CancelButton>
      </Blur>
    </Modal>
  );
};

export default ImagePicker;
