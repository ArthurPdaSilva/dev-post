import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/Auth";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export const Routes = () => {
	const { signed, applicationLoading } = useAuth();

	if (applicationLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#36393f",
				}}
			>
				<ActivityIndicator size="large" color="#E52246" />
			</View>
		);
	}

	if (signed) {
		return <AppRoutes />;
	}

	return <AuthRoutes />;
};
