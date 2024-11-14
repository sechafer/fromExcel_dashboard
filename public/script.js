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
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';

    const emailNames = [...new Set(data.map(row => row.EmailName.split('-')[2]))];
    emailNames.forEach(name => {
        const tab = document.createElement('div');
        tab.classList.add('tab');
        tab.textContent = `BR-EMM-${name}-SKY+`;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filteredData = data.filter(row => row.EmailName.startsWith(`BR-EMM-${name}-SKY+`));
            generateDashboard(filteredData);
        });
        tabsContainer.appendChild(tab);
    });

    const generalTab = document.createElement('div');
    generalTab.classList.add('tab', 'active');
    generalTab.textContent = 'General';
    generalTab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        generalTab.classList.add('active');
        generateDashboard(data);
    });
    tabsContainer.appendChild(generalTab);
}

function generateDashboard(data) {
    const metrics = calculateMetrics(data);
    updateMetricDisplays(metrics);
    createCharts(metrics);
}

function calculateMetrics(data) {
    const totalEmails = data.length - 1;
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
            openRate: ((opened / totalEmails) * 100).toFixed(1),
            bounceRate: ((bounced / totalEmails) * 100).toFixed(1),
            clickRate: ((clicked / opened) * 100).toFixed(1),
            unsubRate: ((unsubscribed / totalEmails) * 100).toFixed(1)
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
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
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
        options: {
            ...chartOptions,
            plugins: {
                tooltip: { enabled: true },
                datalabels: { formatter: (value) => `${value}%`, color: '#fff' }
            }
        }
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
            indexAxis: 'y'
        }
    });

    // Gráfico de Tipos de Rebote (Donut)
    new Chart(document.getElementById('bounceChart'), {
        type: 'doughnut',
        data: {
            labels: ['Hard Bounce', 'Soft Bounce', 'Technical/Other Bounce'],
            datasets: [{
                data: [metrics.hardBounces, metrics.softBounces, metrics.technicalBounces],
                backgroundColor: ['#FF8042', '#FFBB28', '#FF4500']
            }]
        },
        options: chartOptions
    });
}