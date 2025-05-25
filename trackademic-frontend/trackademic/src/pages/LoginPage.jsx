import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [document, setDocument] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await loginRequest(document)
      const token = res.data.token
      localStorage.setItem('token', token)
      login({ document, token }) // Guardamos en contexto
      navigate('/dashboard')
    } catch (err) {
      setError('Documento inválido o usuario no registrado.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        {error && <div className="text-error mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Número de documento"
          className="input input-bordered w-full mb-4"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">Ingresar</button>
      </form>
    </div>
  )
}

export default LoginPage
