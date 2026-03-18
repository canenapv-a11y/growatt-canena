import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ datos
const USERNAME = 'colegio Caena';
const PASSWORD = 'colecanena2025';
const PLANT_ID = '10210610';

app.get('/plant', async (req, res) => {
    try {
        // LOGIN
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

        const cookies = loginRes.headers['set-cookie'];

        // DATOS
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
    console.log('Servidor listo');
});
