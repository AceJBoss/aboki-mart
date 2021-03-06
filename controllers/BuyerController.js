const User = require('../database/models/').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class BuyerController{
    static async login(req, res){
        try{
            let { email, password } = req.body;
            await User.findAll({
                where:{email: email}
            })
                .then(user=>{
                    if(user.length == 0){
                        res.status(400).json({message: "Sorry, Buyer does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, user[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var userDetails = {
                                id: user[0].dataValues.id,
                                first_name: user[0].dataValues.first_name,
                                last_name: user[0].dataValues.last_name,
                                email: user[0].dataValues.email,
                                is_auth: 'buyer'
                            }
                            var token = jwt.sign({
                                user: userDetails
                            }, secret, {});

                            res.status(200).json({
                                success: true,
                                data: user,
                                message: "Login successful. Token generated successfully.",
                                token: token
                            });
                        }else{
                            res.status(401).json({
                                success: false,
                                message: 'Authentication failed. Wrong password'
                            });
                        }
                    }
                })
                .catch(e=>{
                    res.status(500);
                })

        }catch (e) {
            res.send(500);
        }
    }
}
module.exports = BuyerController;