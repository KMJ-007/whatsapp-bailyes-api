import { RequestHandler } from "express";
import { validationResult } from "express-validator";

const requestValidator:RequestHandler = (req, res, next) => {
    console.log("req body",{body:req.body})
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

export default requestValidator;