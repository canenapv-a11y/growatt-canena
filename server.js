const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// ⚠️ tus datos
const USERNAME = 'colegio Caena';
const PASSWORD = 'colecanena2025';
const PLANT_ID = '10210610';

app.get('/plant', async (req, res) => {
    try {
        // 1. LOGIN
        const loginRes = await axios.post(
            'https://server.growatt.com/login',
            new URLSearchParams({
                account: USERNAME,
                password: PASSWORD
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        // 2. EXTRAER COOKIES
        const cookies = loginRes.headers['set-cookie'];

        // 3. PETICIÓN DE DATOS
        const dataRes = await axios.post(
            'https://server.growatt.com/plantDetail',
            new URLSearchParams({
                plantId: PLANT_ID
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Cookie: cookies.join(';')
                }
            }
        );

        res.json(dataRes.data);

    } catch (error) {
        res.json({
            error: true,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log('Servidor funcionando en puerto ' + PORT);
});
