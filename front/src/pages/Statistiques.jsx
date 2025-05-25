import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import Side from '../components/Side';
import { MdBarChart, MdPeople } from 'react-icons/md';
import { FaVenusMars, FaChartBar } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend
);

const Statistiques = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/statistiques');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Données reçues:', data);
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Erreur lors de la récupération des statistiques:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Side>
                <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-[60vh]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00428C]"></div>
                        </div>
                    </div>
                </div>
            </Side>
        );
    }

    if (error) {
        return (
            <Side>
                <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                            <div className="text-2xl font-bold text-red-500">Une erreur est survenue</div>
                            <div className="text-gray-600">{error}</div>
                        </div>
                    </div>
                </div>
            </Side>
        );
    }

    if (!stats) {
        return (
            <Side>
                <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-[60vh]">
                            <div className="text-xl text-gray-600">Aucune donnée disponible</div>
                        </div>
                    </div>
                </div>
            </Side>
        );
    }

    const sexeData = {
        labels: stats.parSexe.map(item => item.sexe),
        datasets: [
            {
                data: stats.parSexe.map(item => item.nombre),
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }
        ]
    };

    const ageData = {
        labels: stats.parAge.map(item => item.tranche_age),
        datasets: [
            {
                label: "Nombre d'enfants par section",
                data: stats.parAge.map(item => item.nombre),
                backgroundColor: ['#FF9F40', '#4BC0C0', '#9966FF'],
                borderColor: ['#FF9F40', '#4BC0C0', '#9966FF'],
                borderWidth: 1
            }
        ]
    };

    return (
        <Side>
            <div className="min-h-screen  p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-center">
                        <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
                            Statistiques de la Crèche
                        </span>
                    </h1>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
                        <div className="flex items-center gap-3">
                            <MdPeople className="w-8 h-8 text-[#00428C]" />
                            <h2 className="text-2xl font-bold text-[#00428C]">
                                Nombre total d'enfants inscrits : {stats.totalEnfants}
                            </h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
                            <div className="flex items-center gap-3 mb-6">
                                <FaVenusMars className="w-6 h-6 text-[#00428C]" />
                                <h2 className="text-xl font-semibold text-[#00428C]">
                                    Répartition par genre
                                </h2>
                            </div>
                            <div className="h-[300px] flex items-center justify-center">
                                <Pie 
                                    data={sexeData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    font: {
                                                        size: 14
                                                    },
                                                    padding: 20
                                                }
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
                            <div className="flex items-center gap-3 mb-6">
                                <FaChartBar className="w-6 h-6 text-[#00428C]" />
                                <h2 className="text-xl font-semibold text-[#00428C]">
                                    Répartition par section
                                </h2>
                            </div>
                            <div className="h-[300px] flex items-center justify-center">
                                <Bar 
                                    data={ageData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1,
                                                    font: {
                                                        size: 12
                                                    }
                                                },
                                                grid: {
                                                    color: 'rgba(0, 66, 140, 0.1)'
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    font: {
                                                        size: 12
                                                    }
                                                },
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Side>
    );
};

export default Statistiques; 