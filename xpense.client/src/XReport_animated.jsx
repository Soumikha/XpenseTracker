import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function XReport() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch expenses data from your API
        // For now, using mock data with more diverse categories
        setLoading(false);
        setExpenses([
            { id: 1, date: '2024-01-15', description: 'Office Supplies', amount: 45.99, category: 'Services' },
            { id: 2, date: '2024-01-16', description: 'Business Lunch', amount: 89.50, category: 'Entertainment' },
            { id: 3, date: '2024-01-17', description: 'Gas', amount: 65.00, category: 'Transportation' },
            { id: 4, date: '2024-01-18', description: 'Groceries', amount: 120.75, category: 'Grocery' },
            { id: 5, date: '2024-01-19', description: 'Online Course', amount: 199.99, category: 'Education' },
            { id: 6, date: '2024-01-20', description: 'Doctor Visit', amount: 150.00, category: 'Health' },
            { id: 7, date: '2024-01-21', description: 'Movie Tickets', amount: 45.00, category: 'Entertainment' },
            { id: 8, date: '2024-01-22', description: 'Uber Ride', amount: 25.50, category: 'Transportation' },
            { id: 9, date: '2024-01-23', description: 'Supermarket', amount: 87.30, category: 'Grocery' },
            { id: 10, date: '2024-01-24', description: 'Internet Bill', amount: 79.99, category: 'Services' },
        ]);
    }, []);

    // Calculate expenses by category for the pie chart
    const getCategoryData = () => {
        const categoryTotals = expenses.reduce((acc, expense) => {
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

        // Create labels with dollar amounts
        const labelsWithAmounts = categories.map((category, index) => {
            const amount = amounts[index];
            const total = amounts.reduce((sum, val) => sum + val, 0);
            const percentage = ((amount / total) * 100).toFixed(1);
            return `${category}\n$${amount.toFixed(2)} (${percentage}%)`;
        });

        return {
            labels: labelsWithAmounts,
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
                position: 'right',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 11,
                        weight: 'bold'
                    },
                    boxWidth: 15,
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const dataset = data.datasets[0];
                                const backgroundColor = dataset.backgroundColor[i];
                                const value = dataset.data[i];
                                const category = label.split('\n')[0]; // Get just the category name
                                
                                return {
                                    text: `${category}: $${value.toFixed(2)}`,
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
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 2,
                cornerRadius: 8,
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                animation: {
                    duration: 400,
                    easing: 'easeOutCubic'
                },
                callbacks: {
                    title: function(context) {
                        const label = context[0].label;
                        return label.split('\n')[0]; // Show just category name in title
                    },
                    label: function(context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return [
                            `Amount: $${value.toFixed(2)}`,
                            `Percentage: ${percentage}%`,
                            `Total: $${total.toFixed(2)}`
                        ];
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

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Expense Reports</h2>
                    
                    {expenses.length === 0 ? (
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
                                                ?? Expenses by Category
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ height: '400px', position: 'relative' }}>
                                                <Pie data={getCategoryData()} options={chartOptions} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Summary Cards */}
                            <div className="row mb-4">
                                {Object.entries(
                                    expenses.reduce((acc, expense) => {
                                        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                                        return acc;
                                    }, {})
                                ).map(([category, amount], index) => {
                                    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                                    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                                    const percentage = ((amount / total) * 100).toFixed(1);
                                    
                                    return (
                                        <div key={category} className="col-md-4 col-sm-6 mb-3">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body text-center">
                                                    <div 
                                                        className="rounded-circle mx-auto mb-3"
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            backgroundColor: colors[index % colors.length],
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <span className="text-white fw-bold">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                    <h6 className="card-title text-muted mb-1">{category}</h6>
                                                    <h4 className="card-text text-dark fw-bold">
                                                        ${amount.toFixed(2)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table Section */}
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
                                        {expenses.map((expense) => (
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
                            </div>
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
                                            <strong>Total Expenses: </strong>
                                            <span className="text-primary fs-5">
                                                ${expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Number of Entries: </strong>
                                            <span className="text-info fs-5">{expenses.length}</span>
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