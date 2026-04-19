import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { NewPost } from "../screens/NewPost";
import { PostsUser } from "../screens/PostsUser";
import { Profile } from "../screens/Profile";
import { Search } from "../screens/Search";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackRoutes = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={Home}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="NewPost"
				component={NewPost}
				options={{
					title: "Novo Post",
					headerTintColor: "#FFF",
					headerStyle: {
						backgroundColor: "#36393f",
					},
				}}
			/>
			<Stack.Screen
				name="PostsUser"
				component={PostsUser}
				options={{
					headerTintColor: "#FFF",
					headerStyle: {
						backgroundColor: "#36393f",
					},
				}}
			/>
		</Stack.Navigator>
	);
};

export const AppRoutes = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				// Ele garante que a barra de navegação inferior seja escondida quando o teclado estiver aberto
				tabBarHideOnKeyboard: true,
				tabBarShowLabel: false,
				tabBarActiveTintColor: "#fff",

				tabBarStyle: {
					backgroundColor: "#202225",
					borderTopWidth: 0,
				},
			}}
		>
			<Tab.Screen
				name="HomeStack"
				component={StackRoutes}
				options={{
					tabBarIcon: (props) => {
						return <Feather name="home" {...props} />;
					},
				}}
			/>

			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarIcon: (props) => {
						return <Feather name="search" {...props} />;
					},
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarIcon: (props) => {
						return <Feather name="user" {...props} />;
					},
				}}
			/>
		</Tab.Navigator>
	);
};
