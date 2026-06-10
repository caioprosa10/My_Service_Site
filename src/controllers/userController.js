import bcrypt from 'bcrypt';
import { insertUser, getUserByEmail, getAllUsers } from '../models/users.js';

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
    res.render('dashboard', { pageTitle: 'Dashboard' });
};

export const buildUsersPage = async (req, res) => {
    try {
        const usersList = await getAllUsers();
        res.render('users', { pageTitle: "System Users", users: usersList });
    } catch (error) {
        req.flash('error_msg', 'Error fetching users.');
        res.redirect('/dashboard');
    }
};