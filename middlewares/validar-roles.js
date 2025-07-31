export const validateAdmiRole=(req,res,next)=>{
    if(!req.user){
        return res.status(500).json({
            msg:'We want to verify the role without first validating the token.'
        });
    }

    const { globalRole, firstName } = req.user;

    if(globalRole!=='Admin'){
        return res.status(403).json({
            msg:`${firstName} no tiene rol de administrador - Acceso denegado.`
        });
    }
    next();
    console.log(`Usuario ${firstName} es Admin. Acceso permitido.`);
}

/* // You can also create a more generic role validation if needed
export const checkRole = (requiredRole) => (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero.'
        });
    }

    const { globalRole, firstName } = req.user;

    if (globalRole !== requiredRole) {
        return res.status(403).json({
            msg: `${firstName} no tiene el rol requerido (${requiredRole}).`
        });
    }

    next();
}; */