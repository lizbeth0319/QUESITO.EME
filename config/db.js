import mongoose from 'mongoose';

const DB_URL = `mongodb://127.0.0.1:27017/QUESITOEME`;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('BD Connected (via db.js)!'); // Se modificó el mensaje de registro para mayor claridad
    } catch (err) {
        console.error('DB Connection Error:', err); // Registra el error
// Opcionalmente, vuelve a generar el error o sale del proceso si la conexión a la BD es crítica
// process.exit(1);
    }
};
export default connectDB;