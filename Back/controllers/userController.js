const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const bodyParser = require('body-parser');


const generateToken = (id) => {
    return jwt.sign({id}, "szupertitkostitok", {expiresIn: "1d"});
}

const register = async (req, res) => {
    const { username, email, password, password2, phonenumber } = req.body;

    //adat validáció
    if (!username || !email || !password || !password2 || !phonenumber) {
        console.log("Kotelezo minden")
        return res.json({ error: "Minden mező kitöltése kötelező!" });
        
    }
    if (password != password2) {
        return res.json({ error: "A két jelszó nem egyezik!" });
    }



    /////////////////////         USERNAME VAN-E             ////////////////////////////////
    const vusername = await prisma.user.findFirst({
        where: {
            username: username,
        }
    });

    if (vusername) {
        return res.json({ error: "Felhasználónév már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////    

    /////////////////////         EMAIL VAN-E             ////////////////////////////////
    const vemail = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    if (vemail) {
        return res.json({ error: "Email-cím már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////

    /////////////////////         TELEFONSZAM VAN-E             ////////////////////////////////
    const telvane = await prisma.user.findFirst({
        where: {
            phonenumber: phonenumber,
        }
    });

    if (telvane) {
        return res.json({ error: "Telefonszám már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////    


    //////// JELSZO TITKOSITAS ///////////////

    const hash = await argon2.hash(password);

    //////////////////////////////////////////

    const newuser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hash,
            phonenumber: phonenumber
        }
    });

    res.json({
        message: "Sikeres regisztráció!",
        newuser
    });
    
}

const login = async (req, res) => {
    const {password, username} = req.body
    // procedurális email validálás
    if (!username || !password) {
        return res.json({ error: "Felhasználónév / Email és jelszó megadása kötelező!" });
    }
    console.log("username, password");
    let user;
  
    if (username.includes('@')) {
        // Ha az 'username' email formátumú, akkor email cím alapján keresünk
        user = await prisma.user.findFirst({
            where: {
                email: username
            }
        });
    } else {
        // Ha nem email, akkor felhasználónév alapján keresünk
        user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
    }



    //if(!user) return res.json({message: "Nem létező fiók!"});

    if (!user) {
        return res.json({ error: "Hibás felhasználónév / email cím vagy jelszó!" });
    }
    


    //passMatch ? res.json({message: "Sikeres bejelentkezés!"}): res.json({message: "Helytelen jelszó!"})
    const passMatch = await argon2.verify(user.password, password);

    if(passMatch){
        // token --> hitelesítő eszköz --> kulcs
        const token = generateToken(user.id)
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        })
    } else {
        return res.json({
            message: "Helytelen jelszó!"
        });
    }
}

const getMe = (req, res) => {
    res.json(req.user)
}

const elveszettallat = async (req, res) => {
    const userId = req.user.id;
    const {
      allatfaj,
      allatkategoria,
      mikorveszettel,
      allatneve,
      allatneme,
      allatszine,
      allatmerete,
      egyeb_infok,
      eltuneshelyszine,
      talalt_elveszett,
    } = req.body;
  
    // Fájl elérési útja
    const filePath = req.file ? req.file.path : null;
  
    // Validáció
    if (
      !allatfaj ||
      !allatkategoria ||
      !mikorveszettel ||
      !allatneve ||
      !allatneme ||
      !allatszine ||
      !allatmerete ||
      !egyeb_infok ||
      !eltuneshelyszine
    ) {
      return res.json({ error: "Minden mező kitöltése kötelező!" });
    }
  
    try {
      // Új állat létrehozása az adatbázisban
      const newEAnimal = await prisma.animal.create({
        data: {
          allatfaj: allatfaj,
          kategoria: allatkategoria,
          datum: mikorveszettel,
          nev: allatneve,
          neme: allatneme,
          szin: allatszine,
          meret: allatmerete,
          egyeb_info: egyeb_infok,
          helyszin: eltuneshelyszine,
          visszakerult_e: "false",
          userId: userId,
          talalt_elveszett: talalt_elveszett || "sajatelveszett", // Alapértelmezett érték
          filePath: filePath, // Kép elérési útjának mentése
        },
      });
  
      res.json({
        message: "Sikeres adatfelvitel!",
        newEAnimal,
      });
    } catch (error) {
      console.error("Hiba történt az adatfelvitel során:", error);
      res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

const talaltallat = async (req, res) => {
    const userId = req.user.id;
    const {
      allatfaj,
      allatkategoria,
      mikorveszettel,
      allatneve,
      allatneme,
      allatszine,
      allatmerete,
      egyeb_infok,
      eltuneshelyszine,
      talalt_elveszett,
    } = req.body;
  
    // Fájl elérési útja
    const filePath = req.file ? req.file.path : null;
  
    // Validáció
    if (
      !allatfaj ||
      !allatkategoria ||
      !mikorveszettel ||
      !allatneve ||
      !allatneme ||
      !allatszine ||
      !allatmerete ||
      !egyeb_infok ||
      !eltuneshelyszine
    ) {
      return res.json({ error: "Minden mező kitöltése kötelező!" });
    }
  
    try {
      // Új állat létrehozása az adatbázisban
      const newEAnimal = await prisma.animal.create({
        data: {
          allatfaj: allatfaj,
          kategoria: allatkategoria,
          datum: mikorveszettel,
          nev: allatneve,
          neme: allatneme,
          szin: allatszine,
          meret: allatmerete,
          egyeb_info: egyeb_infok,
          helyszin: eltuneshelyszine,
          visszakerult_e: "false",
          userId: userId,
          talalt_elveszett: talalt_elveszett || "talaltelveszett", // Alapértelmezett érték
          filePath: filePath, // Kép elérési útjának mentése
        },
      });
  
      res.json({
        message: "Sikeres adatfelvitel!",
        newEAnimal,
      });
    } catch (error) {
      console.error("Hiba történt az adatfelvitel során:", error);
      res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

const getAllUser = async (req, res) => {

    const users = await prisma.user.findMany({
        where : {
            NOT: {
                id: req.user.id
            }
        }
    });
    res.json(users)
}

const osszesallat = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            NOT: {
                id: 0
            }
        },
        include: {
            user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
        }
    });
    res.json(animals);
};

    
/*

{
"talaltvagyelveszett" : "talalt", 
"allatfaj" : "kutya", 
"allatkategoria" : "németdog", 
"mikorveszettel" : "2025-09-09", 
"allatneve" : "habarcs", 
"allatneme" : "kan", 
"allatszine" : "fekete", 
"allatmerete" : "kistestű", 
"egyeb_infok" : "elveszett habarcs nevu kiskutyam", 
"eltuneshelyszine" : "gyula", 
"visszakerult_e" : "false"
}

{

"username" : "proba",
"password" : "proba"
}

*/







module.exports = {
    register,
    login,
    getAllUser,
    getMe,
    elveszettallat,
    talaltallat,
    osszesallat,
}