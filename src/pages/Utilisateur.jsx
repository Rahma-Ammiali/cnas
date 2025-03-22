import React from 'react'
import Side from '../components/Side'
const Utilisateur = () => {

  return (
    <div>
        <Side>
            <div>
                <form action="">
                   <div className='flex flex-col'>
                    <label htmlFor="nom">Nom</label>
                    <input type="text" name="nom" />
                   </div>
                   <div className='flex flex-col'>
                    <label htmlFor="nom">Prenom</label>
                    <input type="text" name="prenom" />
                   </div>
                   <div className='flex flex-col'>
                    <label htmlFor="nom">Num d'agent</label>
                    <input type="text" name="num-agent" />
                   </div>
                   <div className='flex flex-col'>
                    <label htmlFor="nom">Mot de passe</label>
                    <input type="text" name="mot-de-passe" />
                   </div>
                </form>
            </div>
        </Side>
    </div>
  )
}

export default Utilisateur