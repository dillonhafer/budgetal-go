import { TextInput } from "react-native";

export interface InputRef extends React.MutableRefObject<TextInput | null> {}
export const focus = (inputRef: InputRef): void;

