import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function XReport() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch expenses data from your API
        // For now, using mock data with more diverse categories
        setLoading(false);
        
        // Get current date for realistic mock data
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Calculate previous month and year
        const previousMonth = currentMonth - 1;
        const previousYear = previousMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedPreviousMonth = previousMonth < 0 ? 11 : previousMonth;
        
        setExpenses([
            // Current month expenses
            { id: 1, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`, description: 'Office Supplies', amount: 45.99, category: 'Services' },
            { id: 2, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-16`, description: 'Business Lunch', amount: 89.50, category: 'Entertainment' },
            { id: 3, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-17`, description: 'Gas', amount: 65.00, category: 'Transportation' },
            { id: 4, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-18`, description: 'Groceries', amount: 120.75, category: 'Grocery' },
            { id: 5, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19`, description: 'Online Course', amount: 199.99, category: 'Education' },
            { id: 6, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`, description: 'Doctor Visit', amount: 150.00, category: 'Health' },
            { id: 7, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-21`, description: 'Movie Tickets', amount: 45.00, category: 'Entertainment' },
            { id: 8, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-22`, description: 'Uber Ride', amount: 25.50, category: 'Transportation' },
            { id: 9, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-23`, description: 'Supermarket', amount: 87.30, category: 'Grocery' },
            { id: 10, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-24`, description: 'Internet Bill', amount: 79.99, category: 'Services' },
            
            // Previous month expenses
            { id: 11, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-15`, description: 'Office Supplies', amount: 35.50, category: 'Services' },
            { id: 12, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-16`, description: 'Dinner Out', amount: 75.00, category: 'Entertainment' },
            { id: 13, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-17`, description: 'Gas', amount: 55.00, category: 'Transportation' },
            { id: 14, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-18`, description: 'Groceries', amount: 95.25, category: 'Grocery' },
            { id: 15, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-19`, description: 'Books', amount: 150.00, category: 'Education' },
            { id: 16, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-20`, description: 'Pharmacy', amount: 125.00, category: 'Health' },
            { id: 17, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-21`, description: 'Concert', amount: 60.00, category: 'Entertainment' },
            { id: 18, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-22`, description: 'Bus Pass', amount: 30.00, category: 'Transportation' },
            { id: 19, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-23`, description: 'Grocery Store', amount: 110.50, category: 'Grocery' },
            { id: 20, date: `${previousYear}-${String(adjustedPreviousMonth + 1).padStart(2, '0')}-24`, description: 'Phone Bill', amount: 65.00, category: 'Services' },
        ]);
    }, []);

    // Get current month expenses (filter for current month)
    const getCurrentMonthExpenses = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
    };

    // Get previous month expenses
    const getPreviousMonthExpenses = () => {
        const currentDate = new Date();
        const previousMonth = currentDate.getMonth() - 1;
        const previousYear = previousMonth < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
        const adjustedPreviousMonth = previousMonth < 0 ? 11 : previousMonth;
        
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === adjustedPreviousMonth && expenseDate.getFullYear() === previousYear;
        });
    };

    // Calculate expenses by category for the pie chart (current month only)
    const getCategoryData = () => {
        const currentMonthExpenses = getCurrentMonthExpenses();
        const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);

        // Define colors for each category
        const colors = [
            '#FF6384', // Transportation - Red
            '#36A2EB', // Grocery - Blue  
            '#FFCE56', // Entertainment - Yellow
            '#4BC0C0', // Services - Teal
            '#9966FF', // Education - Purple
            '#FF9F40', // Health - Orange
        ];

        return {
            labels: categories,
            datasets: [
                {
                    label: 'Expenses by Category',
                    data: amounts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 15,
                    hoverBorderWidth: 4,
                    hoverBorderColor: '#333',
                },
            ],
        };
    };

    // Get category comparison data
    const getCategoryComparison = () => {
        const currentMonthExpenses = getCurrentMonthExpenses();
        const previousMonthExpenses = getPreviousMonthExpenses();
        
        const currentMonthTotals = currentMonthExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
        
        const previousMonthTotals = previousMonthExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
        
        // Get all unique categories
        const allCategories = new Set([
            ...Object.keys(currentMonthTotals),
            ...Object.keys(previousMonthTotals)
        ]);
        
        const comparison = {};
        allCategories.forEach(category => {
            comparison[category] = {
                current: currentMonthTotals[category] || 0,
                previous: previousMonthTotals[category] || 0
            };
        });
        
        return comparison;
    };

    // Component to render Chart.js vertical bar chart
    const MiniBarChart = ({ currentAmount, previousAmount, color }) => {
        const barData = {
            labels: ['Previous', 'Current'],
            datasets: [
                {
                    label: 'Amount ($)',
                    data: [previousAmount, currentAmount],
                    backgroundColor: [
                        'rgba(233, 236, 239, 0.8)', // Previous month - light gray
                        color + '80' // Current month - category color with transparency
                    ],
                    borderColor: [
                        '#e9ecef', // Previous month border
                        color // Current month border
                    ],
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        };

        const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false,
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                }
            },
            layout: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 10,
                    right: 10
                }
            }
        };

        return (
            <div style={{ height: '80px', width: '100%' }}>
                <Bar data={barData} options={barOptions} />
                <div className="d-flex mt-1" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <small className="text-muted">Prev</small>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <small className="text-muted">Curr</small>
                    </div>
                </div>
            </div>
        );
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeOutBounce',
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 300;
                }
                return delay;
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    boxWidth: 20,
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const dataset = data.datasets[0];
                                const backgroundColor = dataset.backgroundColor[i];
                                const value = dataset.data[i];
                                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                
                                return {
                                    text: `${label}: $${value.toFixed(2)} (${percentage}%)`,
                                    fillStyle: backgroundColor,
                                    strokeStyle: backgroundColor,
                                    lineWidth: 0,
                                    pointStyle: 'circle',
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                cornerRadius: 8,
                animation: {
                    duration: 400,
                    easing: 'easeOutCubic'
                },
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    },
                },
            },
        },
        onHover: (event, elements) => {
            event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        },
        elements: {
            arc: {
                borderWidth: 3,
                borderColor: '#fff',
                hoverBorderWidth: 4,
                hoverBorderColor: '#333',
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const categoryComparison = getCategoryComparison();
    const currentMonthExpenses = getCurrentMonthExpenses();
    const previousMonthExpenses = getPreviousMonthExpenses();

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    
                    
                    {currentMonthExpenses.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                            No expenses found. Start by adding some expenses!
                        </div>
                    ) : (
                        <>
                            {/* Pie Chart Section */}
                            <div className="row mb-5">
                                <div className="col-12">
                                    <div className="card shadow-lg">
                                        <div className="card-header bg-primary text-white">
                                            <h5 className="card-title mb-0">
                                               Sep 2025 Expenses
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ height: '500px', position: 'relative' }}>
                                                <Pie data={getCategoryData()} options={chartOptions} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Summary Cards with Bar Charts */}
                            <div className="row mb-4">
                                    <div className="col-12 mb-3">
                                        <h4 className="text-light">Current vs Previous Month</h4>
                                </div>
                                {Object.entries(categoryComparison).map(([category, amounts], index) => {
                                    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                                    const currentAmount = amounts.current;
                                    const previousAmount = amounts.previous;
                                    const difference = currentAmount - previousAmount;
                                    const percentageChange = previousAmount > 0 ? ((difference / previousAmount) * 100).toFixed(1) : 0;
                                    
                                    return (
                                        <div key={category} className="col-md-4 col-sm-6 mb-3">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <div 
                                                                className="rounded-circle mb-2"
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    backgroundColor: colors[index % colors.length],
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                            </div>
                                                            <h6 className="card-title text-muted mb-1">{category}</h6>
                                                            <h5 className="card-text text-dark fw-bold mb-1">
                                                                ${currentAmount.toFixed(2)}
                                                            </h5>
                                                            <small className="text-muted">
                                                                Previous: ${previousAmount.toFixed(2)}
                                                            </small>
                                                            <div className="mt-1">
                                                                {difference !== 0 && (
                                                                    <span className={`badge ${difference > 0 ? 'bg-danger' : 'bg-success'}`}>
                                                                        {difference > 0 ? '+' : ''}{difference.toFixed(2)} 
                                                                        ({percentageChange > 0 ? '+' : ''}{percentageChange}%)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-5">
                                                            <MiniBarChart 
                                                                currentAmount={currentAmount} 
                                                                previousAmount={previousAmount}
                                                                color={colors[index % colors.length]}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table Section 
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMonthExpenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                                <td>{expense.description}</td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="fw-bold">${expense.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>*/}
                        </>
                    )}
                    
                    {/* Summary Section */}
                    <div className="mt-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Summary</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Total Expenses (Sep 2025): </strong>
                                            <span className="text-primary fs-5">
                                                ${currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Total Expenses (Aug 2025): </strong>
                                            <span className="text-primary fs-5">
                                                ${previousMonthExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default XReport;