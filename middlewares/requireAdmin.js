

const requireAdmin = (req,res,next)=>  {

    if (!req.user) {
        return res.status(401).json({ error: "Utente non autenticato"})
    }

    if(!req.user.isAdmin) {
        return res.status(403).json({ error: "Solo gli amministratori posso eseguire questa operazione"})
    }
    next()
}

export default requireAdmin