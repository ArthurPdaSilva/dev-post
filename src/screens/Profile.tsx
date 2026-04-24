import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
	writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/Auth";
import { db, storage } from "../firebase";
import type { User } from "../types";

export const Profile = () => {
	const { signOut, user, updateCurrentUser } = useAuth();
	const [name, setName] = useState(user?.name ?? "");
	const [url, setUrl] = useState<string | null>(null);
	const [openModal, setOpenModal] = useState(false);

	const updateProfile = async () => {
		if (!user) return;

		if (name === "") {
			alert("Por favor, digite seu nome");
			return;
		}

		if (name === user?.name) {
			alert("O nome é igual ao atual");
			return;
		}

		await updateDoc(doc(db, "users", user.id), {
			name,
		}).then(() => {
			const updatedUser: User = { ...user, name };
			updateCurrentUser(updatedUser);
		});

		const q = query(collection(db, "posts"), where("userId", "==", user?.id));

		const querySnapshot = await getDocs(q);
		const batch = writeBatch(db);

		querySnapshot.forEach((doc) => {
			const docRef = doc.ref;
			batch.update(docRef, { author: name });
		});

		await batch.commit();
		console.log("Bulk update finalizado com sucesso!");
	};

	const uploadFile = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissionResult.granted) {
			Alert.alert(
				"Permissão necessária",
				"Permissão para acessar a biblioteca de mídia é necessária.",
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (result.canceled) {
			Alert.alert(
				"Sem imagem selecionada",
				"Por favor, selecione uma imagem para atualizar seu perfil.",
			);
			return;
		}

		await uploadFileToStorage(result)
			.then(async () => {
				await uploadAvatarPosts();
			})
			.catch(() => {
				Alert.alert(
					"Erro ao enviar imagem",
					"Ocorreu um erro ao enviar a imagem. Por favor, tente novamente.",
				);
				setUrl(null);
				return;
			});
	};

	useEffect(() => {
		let isActive = true;

		async function fetchAvatar() {
			if (!user) return;
			if (!isActive) return;
			const storageRef = ref(storage, `users/${user.id}`);
			try {
				const urlStorage = await getDownloadURL(storageRef);
				setUrl(urlStorage);
			} catch (error) {
				console.log("Erro ao buscar avatar:", error);
			}
		}
		fetchAvatar();

		return () => {
			isActive = false;
			fetchAvatar();
		};
	}, [user]);

	const uploadAvatarPosts = async () => {
		const storageRef = ref(storage, `users/${user?.id}`);
		const urlStorage = await getDownloadURL(storageRef);
		const q = query(collection(db, "posts"), where("userId", "==", user?.id));

		const querySnapshot = await getDocs(q);
		const batch = writeBatch(db);

		querySnapshot.forEach((doc) => {
			const docRef = doc.ref;
			batch.update(docRef, { avatar: urlStorage });
		});

		await batch.commit();
		console.log("Bulk update finalizado com sucesso!");
	};

	const uploadFileToStorage = async (image: ImagePicker.ImagePickerResult) => {
		if (image.assets === null) return;
		const url = image.assets[0].uri;
		const storageRef = ref(storage, `users/${user?.id}`);
		const response = await fetch(url);
		const blob = await response.blob();
		setUrl(url);
		await uploadBytes(storageRef, blob);
	};

	return (
		<View style={styles.container}>
			<Header />

			{url ? (
				<TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
					<Text style={styles.uploadButtonText}>+</Text>
					<Image source={{ uri: url }} style={styles.avatar} />
				</TouchableOpacity>
			) : (
				<TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
					<Text style={styles.uploadButtonText}>+</Text>
				</TouchableOpacity>
			)}

			<Text style={styles.name}>{user?.name}</Text>
			<Text style={styles.email}>{user?.email}</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={() => setOpenModal(true)}
			>
				<Text style={styles.buttonText}>Atualizar Perfil</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, { backgroundColor: "#ddd" }]}
				onPress={signOut}
			>
				<Text style={[styles.buttonText, { color: "#353840" }]}>Sair</Text>
			</TouchableOpacity>

			<Modal visible={openModal} animationType="slide" transparent>
				<KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
					<TouchableOpacity
						style={styles.buttonBack}
						onPress={() => setOpenModal(false)}
					>
						<Feather name="arrow-left" size={22} color="#121212" />
						<Text style={[styles.buttonText, { color: "#353840" }]}>
							Voltar
						</Text>
					</TouchableOpacity>

					<TextInput
						style={styles.input}
						placeholder="Digite seu nome"
						value={name}
						onChangeText={setName}
						keyboardType="default"
					/>

					<TouchableOpacity style={styles.button} onPress={updateProfile}>
						<Text style={styles.buttonText}>Salvar</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#353840",
	},
	name: {
		marginTop: 20,
		marginRight: 20,
		marginLeft: 20,
		fontSize: 28,
		color: "#FFF",
		fontWeight: "bold",
	},
	email: {
		color: "#FFF",
		marginRight: 20,
		marginLeft: 20,
		marginTop: 10,
		fontSize: 18,
		fontStyle: "italic",
	},
	button: {
		marginTop: 16,
		backgroundColor: "#428cfd",
		width: "80%",
		height: 50,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#FFF",
		fontSize: 18,
		fontWeight: "bold",
	},
	uploadButton: {
		marginTop: "20%",
		backgroundColor: "#FFF",
		width: 165,
		height: 165,
		borderRadius: 90,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 9,
	},
	uploadButtonText: {
		fontSize: 55,
		position: "absolute",
		color: "#E52246",
		opacity: 0.4,
		zIndex: 999,
	},
	avatar: {
		width: 160,
		height: 160,
		borderRadius: 80,
	},
	modalContainer: {
		width: "100%",
		height: "70%",
		backgroundColor: "#FFF",
		bottom: 0,
		position: "absolute",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonBack: {
		position: "absolute",
		top: 15,
		left: 15,
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		backgroundColor: "#DDD",
		width: "80%",
		borderRadius: 4,
		padding: 10,
		fontSize: 18,
		textAlign: "center",
		color: "#121212",
	},
});
