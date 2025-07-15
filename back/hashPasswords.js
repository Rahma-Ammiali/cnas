const db= require('./db')
const bcrypt = require('bcrypt')

db.query('SELECT id, password FROM utilisateurs', async(err,results) =>{
    if(err){
        console.err('erreur lors de la récupération des utilisateurs : ',err);
        return ;
    }


for (const user of results ){
    const isAlreadyHashed = user.password.startsWith('$2b$');
    if(!isAlreadyHashed) {
        try{
            const hashedPassword = await bcrypt.hash(user.password,10);
            await new Promise((resolve , reject) =>{
                db.query(
                    'UPDATE utilisateurs SET password = ? WHERE id = ?',
                    [hashedPassword,user.id],
                    (err)=>{
                        if(err) reject(err);
                        else{
                            console.log(`utilisateur ID ${user.id} mis a jour`)
                            resolve();
                        }
                    }
                )
            })
        }catch(error){
            console.error(`erreur lors du hachage de l'utilisateur ID ${user.id}:`,error)
        }
    }else{
        console.log(`utilisateur ID ${user.id} déja hashé`)
    }
}
console.log('tous les mots de passe ont été vérifiés / mis a jour ');
db.end();
})
