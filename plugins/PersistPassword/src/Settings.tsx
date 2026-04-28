import { findByProps } from "@vendetta/metro";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { vstorage } from "./index";

const { ScrollView, View, Text, TextInput, Button } = RN;
const Users = findByProps("getCurrentUser");

export default function SettingsPanel() {
    useProxy(vstorage);

    vstorage.passwords ??= {};

    const [userId, setUserId] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const reset = () => {
        setUserId("");
        setPassword("");
        setEditingId(null);
    };

    const save = () => {
        const id = userId.trim();
        if (!id) return;

        if (editingId && editingId !== id) {
            const { [editingId]: _, ...rest } = vstorage.passwords;
            vstorage.passwords = rest;
        }

        vstorage.passwords = {
            ...vstorage.passwords,
            [id]: password,
        };

        reset();
    };

    const edit = (id: string, pw: string) => {
        setEditingId(id);
        setUserId(id);
        setPassword(pw);
    };

    const remove = (id: string) => {
        const { [id]: _, ...rest } = vstorage.passwords;
        vstorage.passwords = rest;

        if (editingId === id) reset();
    };

    const addCurrent = () => {
        const current = Users.getCurrentUser();
        setEditingId(null);
        setUserId(current?.id?.toString() ?? "");
        setPassword("");
    };

    return (
        <ScrollView style={{ padding: 12 }}>
            <Text style={{ color: "white", marginBottom: 8 }}>User ID</Text>
            <TextInput
                style={inputStyle}
                placeholder="User ID"
                placeholderTextColor="#888"
                value={userId}
                onChangeText={setUserId}
            />

            <Text style={{ color: "white", marginBottom: 8 }}>Password</Text>
            <TextInput
                style={inputStyle}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
            />

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                    <Button title={editingId ? "Save" : "Add"} onPress={save} />
                </View>
                <View style={{ flex: 1 }}>
                    <Button title="Add current" onPress={addCurrent} />
                </View>
                {editingId && (
                    <View style={{ flex: 1 }}>
                        <Button title="Cancel" onPress={reset} />
                    </View>
                )}
            </View>

            {Object.entries(vstorage.passwords).map(([id, pw]) => (
                <View key={id} style={entryStyle}>
                    <Text style={{ color: "white", marginBottom: 4 }}>{id}</Text>
                    <Text style={{ color: "#888", marginBottom: 8 }}>
                        {pw}
                    </Text>

                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Button title="Edit" onPress={() => edit(id, pw)} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button title="Remove" onPress={() => remove(id)} />
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const inputStyle = {
    color: "white",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
};

const entryStyle = {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#222",
};