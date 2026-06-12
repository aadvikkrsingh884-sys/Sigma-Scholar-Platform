import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "./firebase";
import {
  ProgressEntry,
  ProgressInput,
  Bookmark,
  BookmarkInput,
  ChatMessage,
  ChatMessageInput,
} from "@workspace/api-client-react";

// Progress Helpers
export const getProgress = async (userId: string, chapterId: string) => {
  const q = query(
    collection(db, "progress"),
    where("userId", "==", userId),
    where("chapterId", "==", chapterId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ProgressEntry;
};

export const getUserProgress = async (userId: string) => {
  const q = query(
    collection(db, "progress"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProgressEntry[];
};

export const saveProgress = async (data: ProgressInput) => {
  const existing = await getProgress(data.userId, data.chapterId);
  const ref = existing ? doc(db, "progress", existing.id) : doc(collection(db, "progress"));
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (existing) {
    await updateDoc(ref, payload);
  } else {
    await setDoc(ref, payload);
  }
  return { id: ref.id, ...payload };
};

// Bookmark Helpers
export const getUserBookmarks = async (userId: string) => {
  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Bookmark[];
};

export const addBookmark = async (data: BookmarkInput) => {
  const ref = doc(collection(db, "bookmarks"));
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, payload);
  return { id: ref.id, ...payload } as Bookmark;
};

export const removeBookmark = async (bookmarkId: string) => {
  await deleteDoc(doc(db, "bookmarks", bookmarkId));
};

export const isBookmarked = async (userId: string, refId: string) => {
  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", userId),
    where("refId", "==", refId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Chat History Helpers
export const getChatHistory = async (userId: string) => {
  const q = query(
    collection(db, "chatHistory"),
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ChatMessage[];
};

export const saveChatMessage = async (data: ChatMessageInput) => {
  const ref = doc(collection(db, "chatHistory"));
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, payload);
  return { id: ref.id, ...payload } as ChatMessage;
};
