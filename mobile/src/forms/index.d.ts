import { TextInput } from "react-native";

export interface InputRef extends React.MutableRefObject<TextInput | null> {}

export const focus = (inputRef: InputRef): void;

declare class DangerButton extends React.Component<{title?: string, onPress(): void, disabled?: boolean, loading?: boolean}> {}
declare class PrimaryButton extends React.Component<{title?: string, onPress(): void, disabled?: boolean, loading?: boolean}> {}
declare class FieldContainer extends React.Component<{position?: string}> {}
declare class CustomFieldContainer extends React.Component<{position?: string}> {}

