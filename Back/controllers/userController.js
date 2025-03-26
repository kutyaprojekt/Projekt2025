const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const bodyParser = require('body-parser');


const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
}

const register = async (req, res) => {
    const { username, email, password, password2, phonenumber } = req.body;

    //Bekért adatok validálása
    if (!username) { return res.json({ error: "Felhasználónév megadása kötelező" }); }
    if (!email) { return res.json({ error: "Email cím megadása kötelező" }); }
    if (!password || !password2) { return res.json({ error: "Mind 2 jelszó megadása kötelező" }); }
    if (!phonenumber) { return res.json({ error: "Telefonszám megadása kötelező" }); }

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
    const { password, username } = req.body
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

    if (passMatch) {
        // token --> hitelesítő eszköz --> kulcs
        const token = generateToken(user.id)
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        })
    } else {
        return res.json({
            error: "Helytelen jelszó!"
        });
    }
}
const getMe = (req, res) => {
    res.json(req.user)
}

const elveszettallat = async (req, res) => {
    // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Hozzáférés megtagadva: Nincs bejelentkezve felhasználó." });
    }

    const userId = req.user.id; // Felhasználó ID-ja
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
        !mikorveszettel ||
        !allatneve ||
        !allatneme ||
        !allatszine ||
        !allatmerete ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden kötelező mező kitöltése szükséges!" });
    }

    try {
        // Új állat létrehozása az adatbázisban
        const newEAnimal = await prisma.animal.create({
            data: {
                allatfaj: allatfaj,
                kategoria: allatkategoria || null, // Opcionális mező
                datum: mikorveszettel,
                nev: allatneve,
                neme: allatneme,
                szin: allatszine,
                meret: allatmerete,
                egyeb_info: egyeb_infok || null, // Opcionális mező
                helyszin: eltuneshelyszine,
                visszakerult_e: "false",
                userId: userId, // Felhasználó ID-ja kötelezően megadva
                talalt_elveszett: talalt_elveszett || "sajatelveszett",
                filePath: filePath,
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
        nev = "Ismeretlen", // Alapértelmezett érték "Ismeretlen"
        allatfaj = "",
        allatkategoria = "",
        mikorveszettel = "",
        allatneme = "",
        allatszine = "",
        allatmerete = "",
        egyeb_infok = "",
        eltuneshelyszine = "",
        talalt_elveszett = "",
    } = req.body;

    // Fájl elérési útja
    const filePath = req.file ? req.file.path : null;

    // Validáció
    if (
        !allatfaj ||
        !mikorveszettel ||
        !allatszine ||
        !allatmerete ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden mező kitöltése kötelező!" });
    }

    try {
        // Új állat létrehozása az adatbázisban
        const newEAnimal = await prisma.animal.create({
            data: {
                nev: nev, // Itt már csak egyszer adjuk hozzá, az alapértelmezett "Ismeretlen" értékkel
                allatfaj: allatfaj,
                kategoria: allatkategoria,
                datum: mikorveszettel,
                neme: allatneme,
                szin: allatszine,
                meret: allatmerete,
                egyeb_info: egyeb_infok,
                helyszin: eltuneshelyszine,
                visszakerult_e: "false",
                userId: userId,
                talalt_elveszett: talalt_elveszett || "talaltelveszett", 
                filePath: filePath,
                // A "nev: ''," sort TÁVOLÍTSD EL innen!
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
        where: {
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

const osszeselveszett = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            visszakerult_e: "false",
            NOT: {
                id: 0
            },

        },
        include: {
            user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
        }
    });
    res.json(animals);
};

const osszesAdat = async (req, res) => {
    try {
        // Lekérdezzük az összes állatot és a hozzájuk tartozó felhasználókat
        const animals = await prisma.animal.findMany({
            include: {
                user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
            }
        });

        // Lekérdezzük az összes felhasználót is
        const users = await prisma.user.findMany();

        // Összeállítjuk a választ
        const response = {
            animals: animals,
            users: users
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az adatok lekérése során", error });
    }
};

const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Felhasználó ID-ja
    const { username, email, phonenumber, admin, password } = req.body;

    try {
        const updateData = {
            username: username,
            email: email,
            phonenumber: phonenumber,
            admin: admin,
        };

        if (password) {
            updateData.password = await argon2.hash(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        res.json({ message: "Felhasználó adatai frissítve!", updatedUser }); // JSON válasz
    } catch (error) {
        console.error("Hiba történt a felhasználó frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó frissítése során" }); // JSON válasz
    }
};

const updatePassword = async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Felhasználó ID-ja
    const { oldPassword, newPassword } = req.body;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Ellenőrizzük a régi jelszót
        const isPasswordValid = await argon2.verify(user.password, oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Hibás régi jelszó!" });
        }

        // Új jelszó titkosítása
        const hashedPassword = await argon2.hash(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: "Jelszó sikeresen frissítve!" }); // JSON válasz
    } catch (error) {
        console.error("Hiba történt a jelszó frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a jelszó frissítése során" }); // JSON válasz
    }
};

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        res.json(user);
    } catch (error) {
        console.error("Hiba történt a felhasználó lekérése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó lekérése során" });
    }
};

const getAnimalById = async (req, res) => {
    const animalId = parseInt(req.params.id, 10); // Az állat ID-ját kiolvassuk a kérésből

    try {
        // Az állat lekérése az adatbázisból
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
            include: { user: true }, // Ha szükséges, a hozzá tartozó felhasználó adatait is lekérjük
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        res.json(animal); // Visszaadjuk az állat adatait
    } catch (error) {
        console.error("Hiba történt az állat lekérése során:", error);
        res.status(500).json({ error: "Hiba történt az állat lekérése során" });
    }
};

const deleteAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10); // Az állat ID-ját kiolvassuk a kérésből

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található!" });
        }

        // Töröljük a felhasználót
        await prisma.animal.delete({
            where: { id: animalId },
        });

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("Hiba történt a felhasználó törlése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó törlése során" });
    }
}

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Töröljük a felhasználót
        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("Hiba történt a felhasználó törlése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó törlése során" });
    }
};

const megtalalltallatok = async (req, res) => {
    const igaz = "true";
    const animals = await prisma.animal.findMany({
        where: { visszakerult_e: igaz },
        include: {
            user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
        }
    });
    res.json(animals);
};

const userposts = async (req, res) => {

    try {
        const animals = await prisma.animal.findMany({
            where: { userId: req.user.id },
        });

        if (!animals || animals.length === 0) {
            return res.status(404).json({ error: "Nincsenek posztok!" });
        }

        res.json(animals);
    } catch (error) {
        console.error("Hiba történt a posztok lekérése során:", error);
        res.status(500).json({ error: "Hiba történt a posztok lekérése során" });
    }
};

const updatelosttofound = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    try {
        // 1. Állat keresése
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        // 2. Jogosultság ellenőrzése
        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Csak a saját állataidat jelölheted meg megtaláltként!" });
        }

        // 3. Állat státuszának frissítése
        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                visszakerult_e: "true",
            },
        });

        res.json({
            message: "Állat sikeresen megjelölve megtaláltként!",
            animal: updatedAnimal,
        });
    } catch (error) {
        console.error("Hiba történt az állat frissítése során:", error);
        res.status(500).json({ error: "Hiba történt az állat frissítése során" });
    }
};

const editmyprofile = async (req, res) => {
    console.log("editmyprofile called with data:", req.body); // Hibakereséshez
    const userId = req.user.id; // A bejelentkezett felhasználó ID-ja
    const { username, email, oldPassword, newPassword } = req.body;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Jelszó módosítás esetén ellenőrizzük a régi jelszót
        if (oldPassword && newPassword) {
            const isPasswordValid = await argon2.verify(user.password, oldPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Hibás régi jelszó!" });
            }

            // Új jelszó titkosítása
            const hashedPassword = await argon2.hash(newPassword);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        }

        // Felhasználónév és email frissítése
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || user.username,
                email: email || user.email,
            },
        });

        res.json({
            message: "Profil sikeresen frissítve!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Hiba történt a profil frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a profil frissítése során" });
    }
};

const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // A bejelentkezett felhasználó ID-ja

    if (!receiverId || !content) {
        return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
    }

    try {
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });

        res.json({ message: "Üzenet sikeresen elküldve!", newMessage });
    } catch (error) {
        console.error("Hiba történt az üzenet küldése során:", error);
        res.status(500).json({ error: "Hiba történt az üzenet küldése során" });
    }
};

const getMessages = async (req, res) => {
    const userId = req.user.id; // A bejelentkezett felhasználó ID-ja

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId }, // Az általa küldött üzenetek
                    { receiverId: userId }, // Az általa kapott üzenetek
                ],
            },
            include: {
                sender: true, // A küldő felhasználó adatai
                receiver: true, // A címzett felhasználó adatai
            },
            orderBy: {
                createdAt: 'desc', // Legújabb üzenetek elöl
            },
        });

        res.json(messages);
    } catch (error) {
        console.error("Hiba történt az üzenetek lekérése során:", error);
        res.status(500).json({ error: "Hiba történt az üzenetek lekérése során" });
    }
};


module.exports = {
    register,
    login,
    getAllUser,
    getMe,
    elveszettallat,
    talaltallat,
    osszesallat,
    osszesAdat,
    updateUser,
    getUserById,
    deleteUser,
    getAnimalById,
    deleteAnimal,
    megtalalltallatok,
    userposts,
    osszeselveszett,
    editmyprofile,
    sendMessage,
    getMessages,
    updatePassword,
    updatelosttofound,

};