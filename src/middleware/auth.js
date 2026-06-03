export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error_msg', 'You must be logged in to view this page.');
    return res.redirect('/login');
};

export const requireRole = (role) => {
    return (req, res, next) => {
        // Verifica se a sessão e o cargo existem e os converte para minúsculo antes de comparar
        if (req.session && req.session.user && req.session.user.user_role) {
            if (req.session.user.user_role.toLowerCase() === role.toLowerCase()) {
                return next();
            }
        }
        req.flash('error_msg', 'Access denied. This page is for administrators only.');
        return res.redirect('/dashboard');
    };
};