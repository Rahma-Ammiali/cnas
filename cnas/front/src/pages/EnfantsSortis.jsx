import React, { useEffect, useState } from 'react'
import Side from '../components/Side'

function InfoModal({ id, onClose }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`http://localhost:5000/api/dossiers/${id}`).then(r=>r.json()).catch(()=>null),
      fetch(`http://localhost:5000/api/dossiers/${id}/historique`).then(r=>r.json()).catch(()=>[]),
    ]).then(([dossier, hist]) => {
      setData({ dossier, hist: Array.isArray(hist) ? hist : [] })
    })
  }, [id])

  if (!id || !data) return null
  const d = data.dossier || {}
  const h = data.hist || []
  const sortie = h.find(x => x.type === 'sortie')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#00428C]">Détails enfant</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Fermer</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>Nom: <span className="font-medium">{d.nom} {d.prenom}</span></div>
          <div>Date de naissance: <span className="font-medium">{d.date_naissance}</span></div>
          <div>Section: <span className="font-medium">{d.classe}</span></div>
          <div>Handicap: <span className="font-medium">{d.handicap ? `Oui (${d.handicap_details||''})` : 'Non'}</span></div>
          <div>Maladie chronique: <span className="font-medium">{d.maladie_chronique ? `Oui (${d.maladie_details||''})` : 'Non'}</span></div>
          <div>Père: <span className="font-medium">{d.prenom_pere} {d.nom_pere}</span></div>
          <div>Téléphone père: <span className="font-medium">{d.telephone_pere}</span></div>
          <div>Mère: <span className="font-medium">{d.prenom_mere} {d.nom_mere}</span></div>
          <div>Téléphone mère: <span className="font-medium">{d.telephone_mere}</span></div>
          <div>Assurance: <span className="font-medium">{d.assurance_mere_ou_employeur}</span></div>
          <div>Tarif préférentiel: <span className="font-medium">{d.tarif_preferentiel}</span></div>
          <div>Date de sortie: <span className="font-medium">{d.date_sortie ? new Date(d.date_sortie).toLocaleDateString() : '-'}</span></div>
          <div>Raison de sortie: <span className="font-medium">{sortie?.details || '-'}</span></div>
        </div>
      </div>
    </div>
  )
}

function ReinscrireModal({ id, onClose, onDone }) {
  const [date, setDate] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
        <h3 className="text-xl font-semibold text-[#00428C] mb-4">Réinscrire l'enfant</h3>
        <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Date de réinscription</label>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full p-3 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button onClick={() => onDone(date)} className="px-4 py-2 rounded bg-[#00428C] text-white hover:bg-[#006DB8]">Réinscrire</button>
        </div>
      </div>
    </div>
  )
}

export default function EnfantsSortis() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewId, setViewId] = useState(null)
  const [reinsId, setReinsId] = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/dossiers/sortis')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleReinscrire = async (id, date) => {
    try {
      if (!date) { alert('Veuillez choisir une date'); return }
      const res = await fetch(`http://localhost:5000/api/dossiers/${id}/reinscrire`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_reinscription: date })
      })
      if (!res.ok) throw new Error('Erreur serveur')
      await fetchItems()
      setReinsId(null)
      alert('Enfant réinscrit. Il réapparaîtra dans Dossiers.')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <Side>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Enfants sortis
            </span>
          </h2>

          <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
            {loading ? (
              <div className="flex items-center justify-center h-40">Chargement...</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-500">Aucun enfant sorti.</div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#00428C]/5">
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Prénom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Date de sortie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((e) => (
                      <tr key={e.id} className="hover:bg-[#00428C]/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.prenom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.date_sortie ? new Date(e.date_sortie).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                          <button onClick={() => setViewId(e.id)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Voir plus</button>
                          <button onClick={() => setReinsId(e.id)} className="px-4 py-2 rounded-lg bg-[#00428C] text-white hover:bg-[#006DB8]">Réinscrire</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {viewId && <InfoModal id={viewId} onClose={() => setViewId(null)} />}
      {reinsId && <ReinscrireModal id={reinsId} onClose={() => setReinsId(null)} onDone={(d)=> handleReinscrire(reinsId, d)} />}
    </Side>
  )
}
