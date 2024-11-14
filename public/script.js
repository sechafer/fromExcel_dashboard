document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        generateTabs(data);
        generateDashboard(data);
        document.getElementById('dashboardContainer').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el archivo');
    }
});

function generateTabs(data) {
    const tabList = document.createElement('ul');
    tabList.className = 'tab-list';
    
    // Obtener nombres únicos de emails y crear tabs
    const emailNames = [...new Set(data.map(row => {
        const parts = row.EmailName?.split('-') || [];
        return parts[2] || '';
    }))].filter(Boolean); // Filtrar valores vacíos

    // Si solo hay un caso o ninguno, mostrar solo la pestaña General
    if (emailNames.length <= 1) {
        const generalTab = createTab('General', true);
        generalTab.addEventListener('click', () => {
            setActiveTab(generalTab);
            generateDashboard(data);
        });
        tabList.appendChild(generalTab);
    } else {
        // Si hay múltiples casos, mostrar todas las pestañas
        const generalTab = createTab('General', true);
        generalTab.addEventListener('click', () => {
            setActiveTab(generalTab);
            generateDashboard(data);
        });
        tabList.appendChild(generalTab);

        emailNames.forEach(name => {
            const tab = createTab(`BR-EMM-${name}-SKY+`);
            tab.addEventListener('click', () => {
                setActiveTab(tab);
                const filteredData = data.filter(row => 
                    row.EmailName?.startsWith(`BR-EMM-${name}-SKY+`)
                );
                generateDashboard(filteredData);
            });
            tabList.appendChild(tab);
        });
    }

    // Limpiar y agregar nueva lista de tabs
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';
    tabsContainer.appendChild(tabList);
}

function createTab(text, isActive = false) {
    const li = document.createElement('li');
    li.className = `tab ${isActive ? 'active' : ''}`;
    li.textContent = text;
    return li;
}

function setActiveTab(activeTab) {
    // Remover clase active de todas las tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Agregar clase active a la tab seleccionada
    activeTab.classList.add('active');
}

function generateDashboard(data) {
    const metrics = calculateMetrics(data);
    updateMetricDisplays(metrics);
    createCharts(metrics);
}

function calculateMetrics(data) {
    const totalEmails = data.length;
    const opened = data.filter(row => row.opendate).length;
    const bounced = data.filter(row => row.bouncedate).length;
    const clicked = data.filter(row => row.clickdate).length;
    const unsubscribed = data.filter(row => row.unsubscribedate).length;
    const hardBounces = data.filter(row => row.bouncecategory === 'Hard bounce').length;
    const softBounces = data.filter(row => row.bouncecategory === 'Soft bounce').length;
    const technicalBounces = data.filter(row => row.bouncecategory === 'Technical/Other bounce').length;

    return {
        totalEmails,
        opened,
        bounced,
        clicked,
        unsubscribed,
        hardBounces,
        softBounces,
        technicalBounces,
        metrics: {
            openRate: ((opened / (totalEmails - bounced)) * 100).toFixed(1),
            bounceRate: ((bounced / totalEmails) * 100).toFixed(1),
            clickRate: ((clicked / opened) * 100).toFixed(1),
            unsubRate: ((unsubscribed / (totalEmails - bounced)) * 100).toFixed(1)
        }
    };
}

function updateMetricDisplays(metrics) {
    document.getElementById('openRate').textContent = metrics.metrics.openRate + '%';
    document.getElementById('bounceRate').textContent = metrics.metrics.bounceRate + '%';
    document.getElementById('clickRate').textContent = metrics.metrics.clickRate + '%';
    document.getElementById('unsubRate').textContent = metrics.metrics.unsubRate + '%';
}

function createCharts(metrics) {
    // Destruir gráficos existentes si los hay
    ['deliveryChart', 'engagementChart', 'bounceChart'].forEach(chartId => {
        const chartInstance = Chart.getChart(chartId);
        if (chartInstance) {
            chartInstance.destroy();
        }
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    // Gráfico de Estado de Envío (Donut)
    new Chart(document.getElementById('deliveryChart'), {
        type: 'doughnut',
        data: {
            labels: ['Entregados', 'Rebotados'],
            datasets: [{
                data: [metrics.totalEmails - metrics.bounced, metrics.bounced],
                backgroundColor: ['#0088FE', '#FF8042']
            }]
        },
        options: chartOptions
    });

    // Gráfico de Engagement (Barras horizontales)
    new Chart(document.getElementById('engagementChart'), {
        type: 'bar',
        data: {
            labels: ['Abiertos', 'Clicks', 'Bajas'],
            datasets: [{
                data: [metrics.opened, metrics.clicked, metrics.unsubscribed],
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28']
            }]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Tipos de Rebote (Donut)
    new Chart(document.getElementById('bounceChart'), {
        type: 'doughnut',
        data: {
            labels: ['Hard Bounce', 'Soft Bounce', 'Technical/Other'],
            datasets: [{
                data: [metrics.hardBounces, metrics.softBounces, metrics.technicalBounces],
                backgroundColor: ['#FF8042', '#FFBB28', '#FF4500']
            }]
        },
        options: chartOptions
    });
}