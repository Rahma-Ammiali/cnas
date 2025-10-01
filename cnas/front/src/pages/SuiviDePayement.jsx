import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Side from '../components/Side'

const MONTHS = [
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' }
]

const MODES = [
  { value: 'espece', label: 'Espèce' },
  { value: 'virement', label: 'Virement' },
  { value: 'carte', label: 'Lecteur carte' }
]

const MOTIFS = [
  { value: '', label: 'Aucun' },
  { value: 'social', label: 'Motif social' },
  { value: 'fratrie', label: 'Réduction fratrie' },
  { value: 'exceptionnel', label: 'Cas exceptionnel' }
]

export default function SuiviDePayement() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [selectedMonths, setSelectedMonths] = useState([])
  const [monthlyFee, setMonthlyFee] = useState('')
  const [motif, setMotif] = useState('')
  const [mode, setMode] = useState('espece')
  const [numRecepisse, setNumRecepisse] = useState('')
  const [numCompteDebiteur, setNumCompteDebiteur] = useState('')
  const [loading, setLoading] = useState(false)
  const [paiements, setPaiements] = useState([])

  const paidMonths = useMemo(() => {
    const set = new Set()
    for (const p of paiements) {
      if (p && p.months) {
        String(p.months)
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .forEach(m => set.add(m.padStart(2, '0')))
      } else if (p && (p.mois !== undefined && p.mois !== null)) {
        const mm = String(p.mois).padStart(2, '0')
        set.add(mm)
      }
    }
    return set
  }, [paiements])

  const total = useMemo(() => {
    const fee = parseFloat(monthlyFee || '0')
    return (isNaN(fee) ? 0 : fee) * selectedMonths.length
  }, [monthlyFee, selectedMonths])

  useEffect(() => {
    fetchPaiements()
  }, [id])

  const fetchPaiements = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/paiements/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPaiements(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      // ignore
    }
  }

  const toggleMonth = (value) => {
    if (paidMonths.has(value)) return
    setSelectedMonths((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!monthlyFee || selectedMonths.length === 0) {
      alert('Veuillez saisir la mensualité et sélectionner au moins un mois')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/paiements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId: id,
          months: selectedMonths,
          monthly_fee: parseFloat(monthlyFee),
          total_amount: total,
          motif,
          mode,
          recepisse: mode === 'espece' ? numRecepisse : null,
          compte_debiteur: mode !== 'espece' ? numCompteDebiteur : null
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors de l\'enregistrement')
      }
      await fetchPaiements()
      alert('Paiement enregistré avec succès')
      setSelectedMonths([])
      setMonthlyFee('')
      setMotif('')
      setMode('espece')
      setNumRecepisse('')
      setNumCompteDebiteur('')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleValider = async (paymentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/paiements/${paymentId}/valider`, { method: 'PUT' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur lors de la validation')
      }
      await fetchPaiements()
      alert('Paiement validé')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <Side>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(`/dossiers/${id}`)} className="px-4 py-2 rounded-lg bg-[#00428C] text-white hover:bg-[#006DB8] transition">
              Retour au dossier
            </button>
            <h2 className="text-2xl font-bold text-[#00428C]">Suivi de paiement - Participation parentale</h2>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#00428C]/80 mb-2">Mois de paiement (juin à septembre)</label>
                <div className="grid grid-cols-2 gap-3">
                  {MONTHS.map((m) => (
                    <label key={m.value} className={`border rounded-lg px-4 py-3 cursor-pointer select-none flex items-center justify-between ${selectedMonths.includes(m.value) ? 'bg-[#DAEAF4] border-[#7FB3D5]' : 'bg-white border-gray-200'} ${paidMonths.has(m.value) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <span className="flex items-center gap-2">
                        <span>{m.label}</span>
                        {paidMonths.has(m.value) && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Déjà payé</span>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="accent-[#00428C]"
                        checked={selectedMonths.includes(m.value)}
                        onChange={() => toggleMonth(m.value)}
                        disabled={paidMonths.has(m.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#00428C]/80 mb-2">Montant de la participation (mensualité)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  className="w-full p-3 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none"
                  placeholder="Ex: 500.00"
                />
                <p className="mt-2 text-sm text-[#00428C]/70">Total = mensualité × nombre de mois sélectionnés</p>
                <div className="mt-3 text-lg font-semibold text-[#00428C]">Total à payer: {total.toFixed(2)} </div>
              </div>

              <div>
                <label className="block text-sm text-[#00428C]/80 mb-2">Motif du montant préférentiel</label>
                <select value={motif} onChange={(e) => setMotif(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg">
                  {MOTIFS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#00428C]/80 mb-2">Mode de paiement</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg">
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {mode === 'espece' && (
                <div>
                  <label className="block text-sm text-[#00428C]/80 mb-2">Numéro du récépissé</label>
                  <input
                    type="text"
                    value={numRecepisse}
                    onChange={(e) => setNumRecepisse(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                    placeholder="Saisir le numéro du récépissé"
                  />
                </div>
              )}

              {mode !== 'espece' && (
                <div>
                  <label className="block text-sm text-[#00428C]/80 mb-2">Numéro de compte du débiteur</label>
                  <input
                    type="text"
                    value={numCompteDebiteur}
                    onChange={(e) => setNumCompteDebiteur(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                    placeholder="Saisir le RIB/compte"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-[#00428C]/70">La directrice valide après vérification des pièces justificatives.</div>
              <div className="flex gap-3">
                <button disabled={loading} type="submit" className="px-6 py-3 rounded-lg bg-[#00428C] text-white hover:bg-[#006DB8] transition disabled:opacity-60">{loading ? 'Enregistrement...' : 'Enregistrer la saisie'}</button>
              </div>
            </div>
          </form>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-lg font-semibold text-[#00428C] mb-3">Historique des paiements</h3>
            <div className="divide-y">
              {paiements.length === 0 && (
                <div className="text-sm text-gray-500">Aucun paiement enregistré.</div>
              )}
              {paiements.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm">Mois: <span className="font-medium">{(p.months || '').split(',').map(m => MONTHS.find(x => x.value === m)?.label || m).join(', ')}</span></div>
                    <div className="text-sm">Mensualité: {p.monthly_fee} | Total: {p.total_amount ?? (parseFloat(p.monthly_fee || 0) * ((p.months||'').split(',').filter(Boolean).length)).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Mode: {p.mode} {p.mode === 'espece' ? `(Récépissé: ${p.recepisse || '-'})` : `(Compte: ${p.compte_debiteur || '-'})`}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${p.statut_validation === 'Validé' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                      {p.statut_validation || 'En attente'}
                    </span>
                    {p.statut_validation !== 'Validé' && (
                      <button onClick={() => handleValider(p.id)} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">Valider</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Side>
  )
}
