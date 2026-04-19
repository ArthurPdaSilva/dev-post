import { Button, Text, View } from "react-native";
import { useAuth } from "../contexts/Auth";

export const Profile = () => {
	const { signOut } = useAuth();

	return (
		<View>
			<Text>Profile</Text>
			<Button title="Sair" onPress={signOut} />
		</View>
	);
};
