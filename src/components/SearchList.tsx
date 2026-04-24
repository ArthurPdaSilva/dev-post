import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { User } from "../types";

export const SearchList = ({ user }: { user: User }) => {
	const navigation = useNavigation();

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() =>
				// @ts-expect-error
				navigation.navigate("HomeStack", {
					screen: "PostsUser",
					params: { title: user.name, userId: user.id },
				})
			}
		>
			<Text style={styles.name}>{user.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
		marginHorizontal: 10,
		backgroundColor: "#222227",
		padding: 10,
		borderRadius: 4,
	},
	name: {
		fontSize: 17,
		color: "#FFF",
	},
});
