import { useState } from "react";
import {
	ActivityIndicator,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/Auth";
import type { UserForm } from "../types";

export const AuthForm = () => {
	const { signUp, signIn, loading } = useAuth();
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [form, setForm] = useState<UserForm>({
		name: "",
		email: "",
		password: "",
	});

	const handleAuth = () => {
		if (!form.email || !form.password || (!isLogin && !form.name)) {
			alert("Preencha todos os campos!");
			return;
		}

		if (isLogin) {
			signIn(form);
			return;
		}

		signUp(form);
	};

	const toggleLogin = () => {
		Keyboard.dismiss();
		setForm({
			name: "",
			email: "",
			password: "",
		});
		setIsLogin(!isLogin);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>
				Dev <Text style={{ color: "#E52246" }}>Post</Text>
			</Text>

			{!isLogin && (
				<TextInput
					style={styles.input}
					placeholder="Nome"
					value={form.name}
					onChangeText={(text) => setForm({ ...form, name: text })}
				/>
			)}

			<TextInput
				style={styles.input}
				placeholder="Email"
				value={form.email}
				onChangeText={(text) => setForm({ ...form, email: text })}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={form.password}
				onChangeText={(text) => setForm({ ...form, password: text })}
			/>

			<TouchableOpacity style={styles.button} onPress={handleAuth}>
				{loading ? (
					<ActivityIndicator size={20} color="#fff" />
				) : (
					<Text style={styles.buttonText}>
						{isLogin ? "Acessar" : "Criar Conta"}
					</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity style={styles.signUpButton} onPress={toggleLogin}>
				<Text style={styles.signUpText}>
					{isLogin
						? "Não tem uma conta? Clique aqui!"
						: "Já tem uma conta? Clique aqui!"}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#36393f",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		color: "#fff",
		fontSize: 55,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	input: {
		width: "80%",
		backgroundColor: "#fff",
		marginTop: 10,
		padding: 10,
		fontSize: 17,
		borderRadius: 8,
	},
	button: {
		width: "80%",
		backgroundColor: "#418cfd",
		borderRadius: 8,
		marginTop: 10,
		padding: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 20,
	},
	signUpButton: {
		width: "100%",
		borderRadius: 8,
		marginTop: 10,
		alignItems: "center",
	},
	signUpText: {
		color: "#ddd",
		fontSize: 15,
	},
});
