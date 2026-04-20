import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/Auth";
import { db } from "../firebase";
import type { Post } from "../types";

export const PostsList = ({ item }: { item: Post }) => {
	const { user: loggedUser } = useAuth();
	const [likes, setLikes] = useState<number>(item.likes);

	const formatTimePost = () => {
		const datePost = item.created.toDate();
		return formatDistance(new Date(), datePost, { locale: ptBR });
	};

	const handleLikePost = async () => {
		const docId = `${loggedUser?.id}_${item.id}`;
		// await setDoc(doc(db, "likes", loggedUser?.id), {
		// 	Name: loggedUser.name,
		// 	createdAt: new Date(),
		// });

		const docRef = doc(db, "likes", docId);
		const postRef = doc(db, "posts", item.id);

		const docItem = await getDoc(docRef);
		if (docItem.exists()) {
			await updateDoc(postRef, {
				likes: likes - 1,
			}).then(async () => {
				await deleteDoc(docRef).then(() => {
					setLikes(likes - 1);
				});
			});

			return;
		}

		await updateDoc(postRef, {
			likes: likes + 1,
		}).then(async () => {
			await setDoc(docRef, {
				postId: item.id,
				userId: loggedUser?.id,
			}).then(() => {
				setLikes(likes + 1);
			});
		});
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.header}>
				{item.avatar ? (
					<Image source={{ uri: item.avatar }} style={styles.avatar} />
				) : (
					<Image
						source={require("../assets/avatar.png")}
						style={styles.avatar}
					/>
				)}
				<Text style={styles.name} numberOfLines={1}>
					{item.author}
				</Text>
			</TouchableOpacity>

			<View style={styles.contentView}>
				<Text style={styles.content}>{item.content}</Text>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.likeButton} onPress={handleLikePost}>
					<Text style={styles.likeText}>{likes === 0 ? "" : likes}</Text>
					<MaterialCommunityIcons
						name={likes > 0 ? "heart" : "heart-outline"}
						size={20}
						color={"#E54226"}
					/>
				</TouchableOpacity>
				<Text style={styles.timePost}>{formatTimePost()}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 8,
		marginHorizontal: "2%",
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 3,
		elevation: 3,
		padding: 11,
	},
	header: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 6,
	},
	name: {
		color: "#353840",
		fontWeight: "bold",
		fontSize: 18,
	},
	contentView: {},
	content: {
		color: "#353840",
		marginVertical: 4,
	},
	actions: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
	},
	likeButton: {
		width: 45,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	likeText: {
		color: "#E54226",
		marginRight: 4,
	},
	timePost: {
		color: "#121212",
	},
});
