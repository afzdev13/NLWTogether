import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'

import '../../styles/pages/room.scss'
import Button from '../../components/Button/'
import { useAuth } from '../../hooks/useAuth'
import { FormEvent, useEffect, useState } from 'react'
import { database } from '../../services/firebase'

export function NewRoom() {

  const { user, isLoadingUser } = useAuth()
  const [newRoom, setNewRoom] = useState('')
  const history = useHistory()
  async function createNewRoom(event: FormEvent) {
    event.preventDefault()

    if(newRoom.trim() === '') return

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }
  useEffect(() => {
    if(!isLoadingUser && !user){      
      history.push(`/`)
    }
  }, [])

  if(isLoadingUser){
    return <h1>Carregando...</h1>
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={createNewRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala"
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <Button
              type="submit"
            >
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}