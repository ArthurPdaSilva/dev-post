import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import type { User, UserForm } from "../types";

type AuthContextType = {
	user: User | null;
	signed: boolean;
	loading: boolean;
	applicationLoading: boolean;
	updateCurrentUser: (user: User) => Promise<void>;
	signUp: (user: UserForm) => Promise<void>;
	signIn: (user: UserForm) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
	signed: false,
	user: null,
	applicationLoading: true,
	loading: false,
	updateCurrentUser: async () => {},
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [applicationLoading, setApplicationLoading] = useState<boolean>(true);

	const storeUser = async (user: User) => {
		await AsyncStorage.setItem("@devpost_user", JSON.stringify(user));
	};

	const updateCurrentUser = async (user: User) => {
		setUser(user);
		await storeUser(user);
	};

	useEffect(() => {
		const loadUser = async () => {
			const storedUser = await AsyncStorage.getItem("@devpost_user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
				setLoading(false);
			}
			setApplicationLoading(false);
		};

		loadUser();
	}, []);

	const signUp = async (userForm: UserForm) => {
		setLoading(true);

		await createUserWithEmailAndPassword(
			auth,
			userForm.email,
			userForm.password,
		)
			.then(async (userCredential) => {
				const user = userCredential.user;

				await setDoc(doc(db, "users", user.uid), {
					name: userForm.name,
					createdAt: new Date(),
				})
					.then(() => {
						const newUser = {
							id: user.uid,
							email: userForm.email,
							name: userForm.name ?? "",
						};
						setUser(newUser);
						storeUser(newUser);
					})
					.catch((error) => {
						console.error("Erro ao salvar usuário no Firestore:", error);
					})
					.finally(() => {
						setLoading(false);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Erro ao criar usuário:", errorCode, errorMessage);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const signIn = async (userForm: UserForm) => {
		setLoading(true);
		await signInWithEmailAndPassword(auth, userForm.email, userForm.password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				await getDoc(doc(db, "users", user.uid))
					.then((docSnap) => {
						if (docSnap.exists()) {
							const userData = docSnap.data();
							const loggedUser = {
								id: user.uid,
								email: userForm.email,
								name: userData.name ?? "",
							};
							setUser(loggedUser);
							storeUser(loggedUser);
						} else {
							console.error(
								"Nenhum perfil de usuário encontrado no Firestore.",
							);
						}
					})
					.catch((error) => {
						console.error(
							"Erro ao buscar perfil de usuário no Firestore:",
							error,
						);
					})
					.finally(() => {
						setLoading(false);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Erro ao fazer login:", errorCode, errorMessage);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const signOut = async () => {
		await auth.signOut();
		await AsyncStorage.clear();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				signed: !!user,
				user,
				applicationLoading,
				loading,
				signUp,
				signIn,
				signOut,
				updateCurrentUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	return context;
};
