import { useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import '../../styles/auth.scss'
import Button from '../../components/Button/'
import { useAuth } from '../../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../../services/firebase'

export function Home() {
  const [roomCode, setRoomCode] = useState('')

  const history = useHistory()

  const { signInWithGoogle, user } = useAuth()

  const handleCreateRoom = async() => {
    if(!user){
      await signInWithGoogle()
    }
    history.push('/rooms/new')
  }

  const handleJoinRoom = async(event: FormEvent) => {
    event.preventDefault()

    if(roomCode.trim() === '') return

    const RoomRef = await database.ref(`rooms/${roomCode}`).get()

    if(!RoomRef.exists()){
      alert('Sala não encontrada.')
      return
    }

    if(RoomRef.val().endedAt){
      alert('Sala ja encerrada.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt="ilustacao" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as duvidas da sua audiencia em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="logo" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="google logo" />
            Crie sua sala com o Goolge
          </button>
          <div className="separetor">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o codigo da sala"
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button
              type="submit"
            >
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}