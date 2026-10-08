import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocFromServer,
  query,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Section, PortfolioItem, UserProfile } from './types/portfolio';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as the second parameter
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'portfolio', 'profile'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
    }
  }
}

// Real-Time Listeners
export function subscribeToProfile(onData: (profile: UserProfile | null) => void) {
  const profileDoc = doc(db, 'portfolio', 'profile');
  return onSnapshot(
    profileDoc,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as UserProfile);
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'portfolio/profile');
    }
  );
}

export function subscribeToSections(onData: (sections: Section[]) => void) {
  const sectionsCol = collection(db, 'sections');
  return onSnapshot(
    sectionsCol,
    (snapshot) => {
      const list: Section[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Section);
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sections');
    }
  );
}

export function subscribeToItems(onData: (items: PortfolioItem[]) => void) {
  const itemsCol = collection(db, 'items');
  return onSnapshot(
    itemsCol,
    (snapshot) => {
      const list: PortfolioItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as PortfolioItem);
      });
      // Sort newest first
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'items');
    }
  );
}

// Write Operations (include passcode or auth)
export async function syncSaveProfile(profile: UserProfile, passcode = 'Pleasera**123') {
  try {
    await setDoc(doc(db, 'portfolio', 'profile'), {
      ...profile,
      passcode,
      updatedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'portfolio/profile');
  }
}

export async function syncSaveSection(section: Section, passcode = 'Pleasera**123') {
  try {
    await setDoc(doc(db, 'sections', section.id), {
      ...section,
      passcode,
      updatedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `sections/${section.id}`);
  }
}

export async function syncDeleteSection(sectionId: string) {
  try {
    await deleteDoc(doc(db, 'sections', sectionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `sections/${sectionId}`);
  }
}

export async function syncSaveItem(item: PortfolioItem, passcode = 'Pleasera**123') {
  try {
    await setDoc(doc(db, 'items', item.id), {
      ...item,
      passcode,
      updatedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `items/${item.id}`);
  }
}

export async function syncDeleteItem(itemId: string) {
  try {
    await deleteDoc(doc(db, 'items', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `items/${itemId}`);
  }
}
