import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const USERNAME = 'colegio Caena';
const PASSWORD = 'colecanena2025';
const PLANT_ID = '10210610';

app.get('/plant', async (req, res) => {
    try {
        // LOGIN REAL
        const loginRes = await axios.post(
            'https://server.growatt.com/login/login',
            new URLSearchParams({
                account: USERNAME,
                password: PASSWORD
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0',
                    'Origin': 'https://server.growatt.com',
                    'Referer': 'https://server.growatt.com/login'
                }
            }
        );

        const cookies = loginRes.headers['set-cookie'];

        if (!cookies) {
            return res.json({
                error: true,
                message: 'Login fallido (sin cookies)'
            });
        }

        // DATOS
        const dataRes = await axios.post(
            'https://server.growatt.com/plantDetail',
            new URLSearchParams({
                plantId: PLANT_ID
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0',
                    'Origin': 'https://server.growatt.com',
                    'Referer': 'https://server.growatt.com',
                    'Cookie': cookies.join(';')
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

app.get('/', (req, res) => {
    res.send('Servidor Growatt funcionando OK');
});

app.listen(PORT, () => {
    console.log('Servidor listo');
});
