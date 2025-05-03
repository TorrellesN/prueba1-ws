import { Link } from 'react-router-dom'

export default function PVEGameWinView() {
  return (
    <div>
      ¡Finalizado!
      <Link to="/pve/create">J de nuevo</Link>
      <Link to="/">Volver a inicio</Link>
    </div>
  )
}
