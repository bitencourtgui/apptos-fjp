'use client';

import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

import { getFirebaseApp } from '@/lib/firebase/client';

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseStore(): Firestore {
  return getFirestore(getFirebaseApp());
}
