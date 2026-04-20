import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
	collection,
	type DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	type QueryDocumentSnapshot,
	startAfter,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../components/Header";
import { PostsList } from "../components/PostsList";
import { db } from "../firebase";
import type { Post } from "../types";

export const Home = () => {
	const navigate = useNavigation();
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [lastItem, setLastItem] =
		useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
	const [emptyList, setEmptyList] = useState<boolean>(false);

	useFocusEffect(
		useCallback(() => {
			const fetchPosts = async () => {
				const q = query(
					collection(db, "posts"),
					orderBy("created", "desc"),
					limit(5),
				);

				const snapshot = await getDocs(q);
				const postsData: Post[] = [];
				snapshot.forEach((doc) => {
					postsData.push({ id: doc.id, ...doc.data() } as Post);
				});
				const lastDoc = snapshot.docs[snapshot.docs.length - 1];
				setPosts(postsData);
				setLastItem(lastDoc);
				setEmptyList(!!snapshot.empty);
			};

			fetchPosts();
		}, []),
	);

	// Buscar mais posts quando puxar para cima.
	const handleRefreshPost = async () => {
		setLoading(true);

		const q = query(
			collection(db, "posts"),
			orderBy("created", "desc"),
			limit(5),
		);

		const snapshot = await getDocs(q);
		const postsData: Post[] = [];
		snapshot.forEach((doc) => {
			postsData.push({ id: doc.id, ...doc.data() } as Post);
		});
		const lastDoc = snapshot.docs[snapshot.docs.length - 1];
		setPosts(postsData);
		setLastItem(lastDoc);
		setEmptyList(false);
		setLoading(false);
	};

	// Buscar mais posts quando chegar no final da lista.
	const getListPosts = async () => {
		if (emptyList) {
			return;
		}

		const q = query(
			collection(db, "posts"),
			orderBy("created", "desc"),
			limit(5),
			startAfter(lastItem),
		);

		const snapshot = await getDocs(q);
		const postsData: Post[] = [];
		snapshot.forEach((doc) => {
			postsData.push({ id: doc.id, ...doc.data() } as Post);
		});
		const lastDoc = snapshot.docs[snapshot.docs.length - 1];
		setPosts((prevPosts) => [...prevPosts, ...postsData]);
		setLastItem(lastDoc);
		setEmptyList(!!snapshot.empty);
	};

	return (
		<View style={styles.container}>
			<Header />

			<FlatList
				showsVerticalScrollIndicator={false}
				style={styles.listPosts}
				data={posts}
				// Literalmente, quando o usuário puxa a lista para baixo, ele chama a função onRefresh, que é responsável por atualizar os posts. O refreshing é uma propriedade booleana que indica se a lista está sendo atualizada ou não, e é usada para mostrar um indicador de carregamento enquanto os dados estão sendo buscados.
				refreshing={loading}
				onRefresh={handleRefreshPost}
				renderItem={({ item }) => <PostsList item={item} />}
				// A função onEndReached é chamada quando o usuário chega ao final da lista, ou seja, quando ele rola a lista até o final. Ela é usada para carregar mais posts, ou seja, para buscar os próximos posts a partir do último post carregado. O onEndReachedThreshold é uma propriedade que define a distância em pixels do final da lista para que a função onEndReached seja chamada. No caso, 0.1 significa que a função será chamada quando o usuário chegar a 10% do final da lista.
				onEndReached={getListPosts}
				// Quão perto estou no final, aqui eu coloquei 10%
				onEndReachedThreshold={0.1}
			/>

			<TouchableOpacity
				onPress={() => navigate.navigate("NewPost" as never)}
				style={styles.buttonPost}
				activeOpacity={0.8}
			>
				<Feather name="edit-2" size={25} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#36393f",
	},
	buttonPost: {
		position: "absolute",
		bottom: "5%",
		right: "6%",
		backgroundColor: "#202225",
		width: 60,
		height: 60,
		borderRadius: 30,
		zIndex: 999,
		alignItems: "center",
		justifyContent: "center",
	},
	listPosts: {
		flex: 1,
		backgroundColor: "#F1F1F1",
	},
});
