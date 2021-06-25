import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likes: Record<string, {
    authorId: string
  }>
}>

type IUseRoom = {
  questions: QuestionType[],
  title: string
}

export function useRoom(roomCode: string):IUseRoom {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const { user } = useAuth()
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomCode}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => roomRef.off('value')
  }, [roomCode, user?.id])

  return { questions, title }
}