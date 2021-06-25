import Button from '../../components/Button/'
import logoImg from '../../assets/images/logo.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import '../../styles/pages/room.scss'
import { RoomCode } from '../../components/RoomCode/'
import { useParams } from 'react-router-dom'
import { database } from '../../services/firebase'
import { Question } from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'
import deleteButtonImg from '../../assets/images/delete.svg'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'

type RoomParams = {
  id: string
}

export function AdminRoom(){
  const params = useParams<RoomParams>()
  const roomCode = params.id
  const { title, questions, author } = useRoom(roomCode)
  const history = useHistory()

  async function handleEndRoom() {
    await database.ref(`rooms/${roomCode}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(idQuestion: string){
    if (window.confirm('Voce deseja remover essa pergunta?')){
      await database.ref(`rooms/${roomCode}/questions/${idQuestion}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(idQuestion: string){
    await database.ref(`rooms/${roomCode}/questions/${idQuestion}`).update({
      isAnswered: true
    })
  }

  async function handleHighLightQuestion(idQuestion: string){
    await database.ref(`rooms/${roomCode}/questions/${idQuestion}`).update({
      isHighlighted: true
    })
  }

  const { user } = useAuth()

  useEffect(() => {
    if(user && author){
      if (user?.id !== author) {
        alert('Voce nao é o admin dessa pagina')
        history.push(`/`)
      }
    }
  }, [author])

  if(!user || !author){
    return <h1>Validando credenciais...</h1>
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk" />
          <div>
            <RoomCode code={roomCode} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length && <span>{questions.length} pergunta{questions.length > 1 && 's'}</span> }          
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question  
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button onClick={() => handleHighLightQuestion(question.id)}>
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteButtonImg} alt="Deletar pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}