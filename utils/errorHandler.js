function handleError(err,req,res,next){
    console.log(err.code)
    try{
        if (err.code === 11000) { // handle duplicate error
            const field = Object.keys(err.keyValue)[0]; // extract the key
            const value = err.keyValue[field]; // extract the value
            const message = `${field} ${value} is already used`; // construct message without quotes
            return res.status(409).json({ message })
            }
            if (err.name === "CastError"){
                //id is invalid
                return res.status(400).json({message: "invalid id"})
            }
            if (err.name === "ValidationError"){
                //handle duplicate error
                //err.errors 
                // console.log(err.errors)
                const errorMessages = Object.values(err.errors).map(error => error.message.replace(/Path `(\w+)`/, '$1') );

                return res.status(400).json({
                    message: "Validation failed",
                errors: errorMessages,})  //use the correct variable

            }
            //if none of the above conditions match, throw the error
            throw err
    }
    catch(e){//catch and log unexpected errors
        console.log(e)
        return res.status(500).json({message:e.message})

    }
}

module.exports = handleError