import express from "express";
import fetch from "node-fetch";
import tough from "tough-cookie";
import fetchCookie from "fetch-cookie";

const app = express();
const PORT = process.env.PORT || 3000;

const cookieJar = new tough.CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

const USER = process.env.GROWATT_USER;
const PASS = process.env.GROWATT_PASS;
const PLANT = "10210610";

app.get("/plant", async (req, res) => {
  try {
    await fetchWithCookies("https://server.growatt.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      body: new URLSearchParams({
        account: USER,
        password: PASS
      })
    });

    const r = await fetchWithCookies(
      "https://server.growatt.com/panel/plant/getPlantData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0"
        },
        body: new URLSearchParams({
          plantId: PLANT
        })
      }
    );

    const data = await r.text();
    res.send(data);

  } catch (e) {
    res.json({ error: "fallo", detalle: e.toString() });
  }
});

app.listen(PORT, () => console.log("Servidor listo"));
