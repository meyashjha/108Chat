import { Link } from 'react-router-dom'

const Errorpage = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <div>
        <h1>Are you Lost Babygirl!!!</h1>
        <h2><Link to={'/'}>Go Home</Link></h2>            
        </div>
    </div>
  )
}

export default Errorpage