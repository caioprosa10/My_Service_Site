// Verifica se o usuário está logado
export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error_msg', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
};

// Verifica se o usuário tem o cargo (role) necessário
export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.user_role) {
            // Usa toLowerCase() para evitar problemas com 'Admin' vs 'admin'
            if (req.session.user.user_role.toLowerCase() === role.toLowerCase()) {
                return next();
            }
        }
        req.flash('error_msg', 'You do not have permission to access this area.');
        return res.redirect('/dashboard');
    };
};