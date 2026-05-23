import app from './app.js';

// Define a porta. O process.env.PORT é essencial para o Deploy (Render, Heroku, etc.)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando perfeitamente na porta ${PORT}`);
    console.log(`➡️  Acesse: http://localhost:${PORT}`);
});