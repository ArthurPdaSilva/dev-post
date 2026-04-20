import type { Timestamp } from "firebase/firestore";

export type UserForm = {
	name?: string;
	email: string;
	password: string;
};

export type User = {
	id: string;
	name: string;
	email: string;
};

export type Post = {
	id: string;
	content: string;
	avatar?: string | null;
	author: string;
	userId: string;
	likes: number;
	created: Timestamp;
};
