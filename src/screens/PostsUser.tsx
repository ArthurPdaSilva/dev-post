import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Text, View } from "react-native";

export const PostsUser = () => {
	const { params } = useRoute();
	const { title, userId } = params as { title?: string; userId?: string };
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: title || "Usuário",
		});
	}, [navigation, title]);

	return (
		<View>
			<Text>{title}</Text>
		</View>
	);
};
