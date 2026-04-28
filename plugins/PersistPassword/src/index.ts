import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

let patches: (any)[] = [];

const Users = findByProps("getCurrentUser");
const TextInput = findByProps("TextInput", "RNTextInput");

type PasswordStorage = Record<string, string>;

export const vstorage = storage as {
    passwords: PasswordStorage;
};

export default {
    onLoad() {
        vstorage.passwords ??= {};

        patches.push(
            before("render", TextInput.TextInput, ([props]) => {
                if (props?.textContentType !== "password") return;

                const currentUser = Users.getCurrentUser();
                if (!currentUser) return;

                const password = vstorage.passwords[currentUser.id.toString()];
                if (!password) return;

                props.value = password;
                props.onChangeText(password);
                console.log(props);
                console.log(password);
            })
        );
    },

    onUnload() {
        for (const unpatch of patches) unpatch();
        patches = [];
    },

    settings: Settings,
};