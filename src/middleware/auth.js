export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error_msg', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.user_role) {
            if (req.session.user.user_role.toLowerCase() === role.toLowerCase()) {
                return next();
            }
        }
        req.flash('error_msg', 'You do not have permission to access this area.');
        return res.redirect('/dashboard');
    };
};