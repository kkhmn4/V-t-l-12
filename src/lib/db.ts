import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, increment, getDocs, query, where } from 'firebase/firestore';

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
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
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
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Mistake {
  question_id: string;
  wrong_answer: string;
  timestamp: number;
}

export interface KnowledgeLevels {
  biet: number;
  hieu: number;
  van_dung: number;
}

export interface ProgressData {
  student_id: string;
  student_name: string;
  student_email: string;
  lesson_id: string;
  time_spent: number;
  mistakes: Mistake[];
  help_requests: number;
  knowledge_levels: KnowledgeLevels;
  is_completed: boolean;
  last_updated: number;
}

export const initUserProgress = async (userId: string, userName: string, userEmail: string, lessonId: string = 'cau-truc-hat-nhan') => {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(db, 'progress', docId);
  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const initialData: ProgressData = {
        student_id: userId,
        student_name: userName,
        student_email: userEmail,
        lesson_id: lessonId,
        time_spent: 0,
        mistakes: [],
        help_requests: 0,
        knowledge_levels: { biet: 0, hieu: 0, van_dung: 0 },
        is_completed: false,
        last_updated: Date.now()
      };
      await setDoc(docRef, initialData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `progress/${docId}`);
  }
};

export const updateTimeSpent = async (userId: string, timeSpent: number, lessonId: string = 'cau-truc-hat-nhan') => {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(db, 'progress', docId);
  try {
    await updateDoc(docRef, {
      time_spent: increment(timeSpent),
      last_updated: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `progress/${docId}`);
  }
};

export const logMistake = async (userId: string, mistake: Mistake, lessonId: string = 'cau-truc-hat-nhan') => {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(db, 'progress', docId);
  try {
    await updateDoc(docRef, {
      mistakes: arrayUnion(mistake),
      last_updated: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `progress/${docId}`);
  }
};

export const logHelpRequest = async (userId: string, lessonId: string = 'cau-truc-hat-nhan') => {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(db, 'progress', docId);
  try {
    await updateDoc(docRef, {
      help_requests: increment(1),
      last_updated: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `progress/${docId}`);
  }
};

export const completeLesson = async (userId: string, knowledgeLevels: KnowledgeLevels, lessonId: string = 'cau-truc-hat-nhan') => {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(db, 'progress', docId);
  try {
    await updateDoc(docRef, {
      knowledge_levels: knowledgeLevels,
      is_completed: true,
      last_updated: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `progress/${docId}`);
  }
};

export const getAllStudentProgress = async (lessonId: string = 'cau-truc-hat-nhan') => {
  const progressList: ProgressData[] = [];
  const q = query(collection(db, 'progress'), where('lesson_id', '==', lessonId));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      progressList.push(doc.data() as ProgressData);
    });
    return progressList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'progress');
    return [];
  }
};
