const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Conversión de la hoja de Excel a JSON
        let jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });

        // Verificamos si hay más de 20,000 registros y reducimos si es necesario
        if (jsonData.length > 20000) {
            const dateMap = new Map();

            jsonData.forEach(row => {
                const date = row.sentdate?.split(" ")[0] || ''; // Tomamos solo la fecha
                if (!dateMap.has(date)) {
                    dateMap.set(date, {
                        total: 0, 
                        opened: 0, 
                        bounced: 0, 
                        clicked: 0, 
                        unsubscribed: 0,
                        hardBounces: 0, 
                        softBounces: 0, 
                        technicalBounces: 0
                    });
                }

                const dateData = dateMap.get(date);
                dateData.total++;
                if (row.opendate) dateData.opened++;
                if (row.bouncedate) {
                    dateData.bounced++;
                    if (row.bouncecategory === 'Hard bounce') dateData.hardBounces++;
                    else if (row.bouncecategory === 'Soft bounce') dateData.softBounces++;
                    else if (row.bouncecategory === 'Technical/Other bounce') dateData.technicalBounces++;
                }
                if (row.clickdate) dateData.clicked++;
                if (row.unsubscribedate) dateData.unsubscribed++;
                dateMap.set(date, dateData);
            });

            // Convertimos el Map a un arreglo de objetos para enviarlo como JSON
            jsonData = Array.from(dateMap, ([date, values]) => ({
                date,
                ...values
            }));
        }

        res.json(jsonData);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});