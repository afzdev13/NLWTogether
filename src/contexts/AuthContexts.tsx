import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from '../services/firebase'

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle: () => Promise<void>,
  isLoadingUser: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export default function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>()
  const [isLoadingUser, setIsLoading] = useState(false)

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user
  
      if (!displayName || !photoURL) {
        throw new Error('Missing Information from Google Account.')
      }
  
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL 
      })
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
  
        if (!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL 
        })
        setIsLoading(false)
      }
    })
  
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{user, signInWithGoogle, isLoadingUser}}>
      {props.children}
    </AuthContext.Provider>
  )
}