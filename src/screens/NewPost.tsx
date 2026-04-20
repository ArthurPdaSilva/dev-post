import { useNavigation } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useLayoutEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../contexts/Auth";
import { db, storage } from "../firebase";

export const NewPost = () => {
	const { user } = useAuth();
	const [text, setText] = useState<string>("");
	const navigate = useNavigation();

	const handlePost = async () => {
		if (text.length === 0) {
			return;
		}

		let avatarUrl = null;
		try {
			const response = await ref(storage, `avatars/${user?.id}`);
			avatarUrl = await getDownloadURL(response);
		} catch (error) {
			console.error("Erro ao obter URL do avatar:", error);
		}

		await addDoc(collection(db, "posts"), {
			created: new Date(),
			content: text,
			avatar: avatarUrl,
			author: user?.name || "Anônimo",
			userId: user?.id || null,
			likes: 0,
		})
			.then(() => {
				setText("");
				console.log("Post criado com sucesso!");
			})
			.catch((error) => {
				console.error("Erro ao criar post:", error);
			})
			.finally(() => {
				navigate.goBack();
			});
	};

	// Síncrono com o layout, ou seja, antes de renderizar a tela, ele executa o código dentro do useLayoutEffect
	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	useLayoutEffect(() => {
		navigate.setOptions({
			headerRight: () => (
				<TouchableOpacity style={styles.button} onPress={handlePost}>
					<Text style={styles.buttonText}>Compartilhar</Text>
				</TouchableOpacity>
			),
		});
	}, [navigate, text]);

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="O que está acontecendo?"
				style={styles.input}
				value={text}
				onChangeText={setText}
				autoCorrect={false}
				multiline
				maxLength={300}
				placeholderTextColor="#DDD"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#404349",
	},
	input: {
		backgroundColor: "transparent",
		margin: 10,
		color: "#fff",
		fontSize: 20,
	},
	button: {
		marginRight: 7,
		paddingVertical: 5,
		paddingHorizontal: 12,
		backgroundColor: "#418cfd",
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
	},
});
