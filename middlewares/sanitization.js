import DOMPurify from "isomorphic-dompurify";

function sanitizeInput(req, res, next) {
    try {
        if (req.body) {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = DOMPurify.sanitize(req.body[key]);
                }
            }
        }
        next();
    } catch (error) {
        console.log('Malicious code detected', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export default sanitizeInput