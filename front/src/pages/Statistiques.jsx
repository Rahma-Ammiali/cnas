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
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00428C]"></div>
                </div>
            </Side>
        );
    }

    if (error) {
        return (
            <Side>
                <div className="flex flex-col items-center justify-center h-[80vh]">
                    <div className="text-red-500 text-xl mb-4">Une erreur est survenue</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </Side>
        );
    }

    if (!stats) {
        return (
            <Side>
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="text-gray-600">Aucune donnée disponible</div>
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
                label: 'Nombre d\'enfants par section',
                data: stats.parAge.map(item => item.nombre),
                backgroundColor: ['#FF9F40', '#4BC0C0', '#9966FF'],
                borderColor: ['#FF9F40', '#4BC0C0', '#9966FF'],
                borderWidth: 1
            }
        ]
    };

    return (
        <Side>
            <div className="p-2">
                <h1 className="text-2xl font-bold text-[#00428C] mb-6">
                    Statistiques de la Crèche
                </h1>
                
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 mb-6">
                    <h2 className="text-xl font-semibold text-[#00428C]">
                        Nombre total d'enfants inscrits : {stats.totalEnfants}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100" >
                        <h2 className="text-lg font-semibold text-[#00428C] mb-4">
                            Répartition par genre
                        </h2>
                        <div className="h-[250px] flex items-center justify-center">
                            <Pie 
                                data={sexeData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                        <h2 className="text-lg font-semibold text-[#00428C] mb-4">
                            Répartition par section
                        </h2>
                        <div className="h-[250px] flex items-center justify-center">
                            <Bar 
                                data={ageData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1
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
        </Side>
    );
};

export default Statistiques; 