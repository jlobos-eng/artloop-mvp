const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Lógica de Entorno (Producción vs Local)
let serviceAccount;
if (process.env.FIREBASE_CONFIG) {
    // Si estamos en Render, lee el secreto encriptado
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
    // Si estamos en tu Mac, lee el archivo físico
    serviceAccount = require("./serviceAccount.json");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// --- LÓGICA DE NEGOCIO CON PERSISTENCIA ---

// Obtener catálogo desde Firestore
app.get('/api/drops', async (req, res) => {
    try {
        const snapshot = await db.collection('drops').get();
        const drops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(drops);
    } catch (error) {
        res.status(500).send(error);
    }
});

// El Flywheel con persistencia real
app.post('/api/drops/:id/buy-print', async (req, res) => {
    const dropId = req.params.id;
    const dropRef = db.collection('drops').doc(dropId);

    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(dropRef);
            if (!doc.exists) throw "Obra no existe";

            const data = doc.data();
            if (data.printsSold >= data.totalPrints) throw "Agotado";

            const newPrintsSold = data.printsSold + 1;
            const bidIncrease = Math.floor(Math.random() * 15) + 10;
            const newBid = data.originalBid + bidIncrease;

            t.update(dropRef, {
                printsSold: newPrintsSold,
                originalBid: newBid
            });
        });

        const updated = await dropRef.get();
        res.json({ success: true, drop: { id: updated.id, ...updated.data() } });
    } catch (error) {
        res.status(400).json({ error });
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 ArtLoop con Firebase en puerto ${PORT}`));