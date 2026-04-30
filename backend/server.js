const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

let serviceAccount;
if (process.env.FIREBASE_CONFIG) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} else {
    serviceAccount = require("./serviceAccount.json");
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Obtener todas las obras
app.get('/api/drops', async (req, res) => {
    try {
        const snapshot = await db.collection('drops').get();
        const drops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(drops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Comprar un Print (Sube el precio del original)
app.post('/api/drops/:id/buy-print', async (req, res) => {
    try {
        const dropRef = db.collection('drops').doc(req.params.id);
        const doc = await dropRef.get();
        if (!doc.exists) return res.status(404).send('Obra no encontrada');

        const data = doc.data();
        const newPrintsSold = (data.printsSold || 0) + 1;
        const newOriginalBid = (data.originalBid || 0) + 125; // Sube $125 por cada print

        await dropRef.update({ printsSold: newPrintsSold, originalBid: newOriginalBid });
        res.json({ success: true, drop: { id: doc.id, ...data, printsSold: newPrintsSold, originalBid: newOriginalBid } });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 3. NUEVO: Subir obra desde el Panel de Admin
app.post('/api/admin/add-drop', async (req, res) => {
    try {
        const newDrop = {
            ...req.body,
            printsSold: 0,
            originalBid: Number(req.body.originalBid),
            printPrice: Number(req.body.printPrice),
            totalPrints: Number(req.body.totalPrints || 500),
            status: 'early',
            timeLeft: '24h 00m'
        };
        const docRef = await db.collection('drops').add(newDrop);
        res.json({ success: true, id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 ArtLoop Engine en puerto ${PORT}`));