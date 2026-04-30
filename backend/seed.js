const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Catálogo Premium con imágenes reales (Unsplash de alta calidad)
const premiumDrops = [
    {
        title: "Ecos del Vacío",
        artist: "Elena Rostova",
        originalBid: 8500,
        printsSold: 412,
        totalPrints: 500,
        printPrice: 89,
        timeLeft: "04h 12m",
        status: "hot",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000" // Arte abstracto
    },
    {
        title: "Génesis Fragmentado",
        artist: "Marcus V.",
        originalBid: 12400,
        printsSold: 495,
        totalPrints: 500,
        printPrice: 120,
        timeLeft: "01h 05m",
        status: "hot",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" // Pintura clásica/moderna
    },
    {
        title: "Distopía Neón",
        artist: "Kael",
        originalBid: 3200,
        printsSold: 89,
        totalPrints: 250,
        printPrice: 59,
        timeLeft: "1d 14h",
        status: "early",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000" // Digital/Líquido abstracto
    }
];

async function seed() {
    console.log("⏳ Inyectando obras premium en Firestore...");
    for (const item of premiumDrops) {
        await db.collection('drops').add(item);
    }
    console.log("✅ ¡Catálogo ArtLoop Premium cargado con éxito!");
    process.exit();
}

seed();