// W05 - Protected Access: Exige que o usuário esteja logado
export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error_msg', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
};

// W05 - Protected Access: Exige permissão de Admin (Organizações, Projetos, Categorias e Users)
export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.user_role) {
            if (req.session.user.user_role.toLowerCase() === role.toLowerCase()) {
                return next();
            }
        }
        req.flash('error_msg', 'Access denied. You do not have admin permissions.');
        return res.redirect('/dashboard');
    };
};