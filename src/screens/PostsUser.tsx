import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { PostsList } from "../components/PostsList";
import { db } from "../firebase";
import type { Post } from "../types";

export const PostsUser = () => {
	const { params } = useRoute();
	const { title, userId } = params as { title?: string; userId?: string };
	const navigation = useNavigation();
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: title || "Usuário",
		});
	}, [navigation, title]);

	useFocusEffect(
		// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
		useCallback(() => {
			let isActive = true;
			const getPostsUser = async () => {
				const q = query(
					collection(db, "posts"),
					// Só vai funcionar se eu criar um index composto com userId e created.
					where("userId", "==", userId),
					orderBy("created", "desc"),
				);

				if (!isActive) return;

				const snapshot = await getDocs(q);

				const postsData: Post[] = [];
				snapshot.forEach((doc) => {
					postsData.push({ id: doc.id, ...doc.data() } as Post);
				});

				setPosts(postsData);
				setLoading(false);
			};

			getPostsUser();

			return () => {
				isActive = false;
			};
		}, []),
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator size={30} color="#E52246" />
				</View>
			) : (
				<FlatList
					style={styles.listPosts}
					data={posts}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <PostsList item={item} />}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listPosts: {
		flex: 1,
	},
});
