import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AuthProvider } from "./src/contexts/Auth";
import { Routes } from "./src/routes";

export default function App() {
	return (
		<NavigationContainer>
			<AuthProvider>
				<StatusBar
					barStyle="light-content"
					backgroundColor="#36393f"
					translucent={false}
				/>
				<Routes />
			</AuthProvider>
		</NavigationContainer>
	);
}
