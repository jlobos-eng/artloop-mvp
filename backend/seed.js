const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

// Conectamos con tu llave privada
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Los datos iniciales de nuestro Drop
const initialData = [
    {
        title: "Caos Sintético",
        artist: "Elías K.",
        originalBid: 4250,
        printsSold: 342,
        totalPrints: 500,
        printPrice: 49,
        timeLeft: "14h 22m",
        status: "hot",
        image: "linear-gradient(135deg, #3b0764 0%, #0f172a 100%)"
    }
];

// Función para inyectar a la base de datos
async function seed() {
    console.log("⏳ Inyectando obras en la nube...");
    for (const item of initialData) {
        await db.collection('drops').add(item);
    }
    console.log("✅ ¡Base de datos ArtLoop inicializada con éxito!");
    process.exit();
}

seed();