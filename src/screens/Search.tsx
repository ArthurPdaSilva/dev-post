import { Feather } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchList } from "../components/SearchList";
import { db } from "../firebase";
import type { User } from "../types";

export const Search = () => {
	const [input, setInput] = useState("");
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		if (input.length === 0) {
			setUsers([]);
			return;
		}

		const q = query(
			collection(db, "users"),
			// Só vai funcionar se eu criar um index composto com userId e created.
			where("name", ">=", input),
			where("name", "<=", `${input}\uf8ff`),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const list: User[] = [];
			snapshot.forEach((doc) => {
				list.push({ id: doc.id, ...doc.data() } as User);
			});
			setUsers(list);
		});

		return () => {
			unsubscribe();
		};
	}, [input]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.areaInput}>
				<Feather name="search" size={20} color="#E52246" />
				<TextInput
					style={styles.input}
					placeholder="Procurando alguém?"
					value={input}
					onChangeText={setInput}
					placeholderTextColor="#353840"
				/>
			</View>
			<FlatList
				style={styles.list}
				data={users}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SearchList user={item} />}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 14,
		backgroundColor: "#353840",
	},
	areaInput: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F1F1F1",
		margin: 10,
		borderRadius: 4,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	input: {
		width: "90%",
		backgroundColor: "#F1F1F1",
		height: 40,
		paddingLeft: 8,
		fontSize: 17,
		color: "#121212",
	},
	list: {
		flex: 1,
	},
});
