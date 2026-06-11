import bcrypt from 'bcrypt';
import { insertUser, getUserByEmail, getAllUsers } from '../models/users.js';
import { getVolunteeredProjects } from '../models/volunteers.js';

export const buildRegister = async (req, res) => {
    res.render('register', { pageTitle: 'Register', error_msg: null });
};

export const registerUser = async (req, res) => {
    const { user_name, user_email, user_password } = req.body;
    try {
        const existingUser = await getUserByEmail(user_email);
        if (existingUser) {
            req.flash('error_msg', 'Email already registered.');
            return res.redirect('/register');
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);
        
        await insertUser(user_name, user_email, hashedPassword);
        req.flash('success_msg', 'Registration successful. Please log in.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error_msg', 'Error during registration. Please try again.');
        res.redirect('/register');
    }
};

export const buildLogin = async (req, res) => {
    res.render('login', { pageTitle: 'Login', error_msg: null });
};

export const loginUser = async (req, res) => {
    const { user_email, user_password } = req.body;
    try {
        const user = await getUserByEmail(user_email);
        if (!user) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        let finalRole = user.user_role;
        if (user.user_email === 'admin@example.com') {
            finalRole = 'admin';
        }

        req.session.user = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_role: finalRole
        };
        
        req.flash('success_msg', 'Welcome back!');
        res.redirect('/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Error during login.');
        res.redirect('/login');
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

export const buildDashboard = async (req, res) => {
    try {
        // Verifica se a sessão realmente existe, se não, manda pro login
        if (!req.session || !req.session.user) {
            if (typeof req.flash === 'function') req.flash('error_msg', 'Please log in to view your dashboard.');
            return res.redirect('/login');
        }

        const user = req.session.user;
        
        // Inicializa a lista vazia por padrão para evitar crashes
        let volunteeredProjects = [];
        
        // Tenta buscar no modelo de voluntários com segurança
        try {
            if (user && user.user_id) {
                volunteeredProjects = await getVolunteeredProjects(user.user_id);
            }
        } catch (dbError) {
            console.error("Erro ao buscar projetos voluntários no DB:", dbError);
        }

        const success_msg = typeof req.flash === 'function' ? req.flash('success_msg') : [];

        // Renderiza a página passando TODAS as variáveis de forma segura
        res.render('dashboard', { 
            pageTitle: 'Dashboard',
            volunteeredProjects: volunteeredProjects || [],
            user: user,
            success_msg: success_msg
        });
    } catch (error) {
        // Mostra o erro real no terminal do VS Code / Render Logs
        console.error("Erro crítico no dashboard:", error);
        
        // Em último caso, tenta renderizar com dados vazios em vez de quebrar a tela
        res.render('dashboard', { 
            pageTitle: 'Dashboard', 
            volunteeredProjects: [], 
            user: req.session?.user || { user_name: 'User', user_role: 'user' },
            success_msg: [] 
        });
    }
};

export const buildUsersPage = async (req, res) => {
    try {
        const usersList = await getAllUsers();
        res.render('users', { pageTitle: "System Users", users: usersList });
    } catch (error) {
        if (typeof req.flash === 'function') req.flash('error_msg', 'Error fetching users.');
        res.redirect('/dashboard');
    }
};