import { StyleSheet, Text, View } from "react-native";

export const Header = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Dev<Text style={styles.titleHighlight}>Post</Text>
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: "#363840",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#C7C7C7",
	},
	title: {
		fontSize: 27,
		fontWeight: "bold",
		paddingBottom: 15,
		color: "#fff",
	},
	titleHighlight: {
		fontStyle: "italic",
		color: "#E54226",
	},
});
