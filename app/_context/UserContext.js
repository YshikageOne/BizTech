import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../_config/firebase';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [profile, setProfile]     = useState(null);
  const [initializing, setInit]   = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      console.log("🔔 onAuthStateChanged → fbUser:", fbUser?.email);
      setUser(fbUser);

      if (!fbUser) {
        console.log("👉 no FB user, clearing profile");
        setProfile(null);
        setInit(false);
        return;
      }

      //use email as the document ID:
      const email = fbUser.email;
      const userRef = doc(db, 'users', email);
      const snap    = await getDoc(userRef);
      console.log("📑 fetched users/%s → exists?", email, snap.exists(), snap.data());

      if (!snap.exists()) {
        //first sign-in → seed the doc:
        const newProfile = {
          uid:         fbUser.uid,
          name: fbUser.name || email.split('@')[0],
          photoURL:    fbUser.photoURL  || 'https://…/alice.jpg',
          status:      'Active'
        };

        console.log("✨ seeding newProfile:", newProfile);
        await setDoc(userRef, newProfile);
        setProfile(newProfile);

        //also sync Auth’s displayName/photoURL
        await updateProfile(auth.currentUser, {
          name: newProfile.name,
          photoURL:    newProfile.photoURL
        });
      } else {
        setProfile(snap.data());
      }

      console.log("✅ profile state set:", snap.exists() ? snap.data() : newProfile);
      setInit(false);
    });

    return unsub;
  }, []);

  //call this whenever you want to update one or more fields:
  const updateUserProfile = async (updates) => {
    if (!user?.email) return;
    const userRef = doc(db, 'users', user.email);
    await updateDoc(userRef, updates);
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      initializing,
      signIn:      (e,p) => signInWithEmailAndPassword(auth,e,p),
      signOutUser: ()    => signOut(auth),
      updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};