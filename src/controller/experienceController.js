import { Prisma } from "../application/prisma.js";
import { Validate } from "../application/validate.js";
import { ResponseError } from "../error/responseError.js";
import { isExperience } from "../validation/experienceValidation.js";
import { isID } from "../validation/mainValidation.js";

//  PATH: METHOD GET UNTUK MENGAMBIL DATA BLOG
const getAll = async (req, res, next) => {
    try {
        // FIND MANY -> ambil semua blog
        const data = await getExperience();

        res.status(200).json({
            message: "Berhasil mendapatkan semua data experience",
            data
        });
    } catch (error) {
        next(error);
    }
};

const getExperience = async () => {
    return await Prisma.experience.findMany();
}

//  GET BY ID
const get = async (req, res, next) => {
    try {
        let id = req.params.id;

        id = Validate(isID, id);

        const data = await Prisma.experience.findFirst({
            where: { id }
        });

        // HANDLE NOT FOUND
        if (data == null) throw new ResponseError(404, `Blog dengan ${id} tidak ditemukan`);

        res.status(200).json({
            message: "Berhasil",
            data
        });
    } catch (error) {
        next(error)
    }

};

// PATH: METHOD POST UNTUK MENYIMPAN DATA EDUCATION
const post = async (req, res, next) => {
    try {
        let data = req.body;

        data = Validate(isExperience, data);

        const newExperience = await Prisma.experience.create({
            data
        });

        res.status(200).json({
            message: "Data berhasil disimpan",
            data: newExperience
        });
    } catch (error) {
        next(error)
    }

};

// PATH: METHOD PUT UNTUK MENYIMPAN SELURUH DATA experience
const put = async (req, res, next) => {
    try {
        let experience = req.body;
        let id = req.params.id;

        id = Validate(isID, id);

        experience = Validate(isExperience, experience);

        const currentExperience = await Prisma.experience.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!currentExperience) throw new ResponseError(404, `Blog dengan ${id} tidak ditemukan`);

        const data = await Prisma.experience.update({
            where: { id }, data: experience
        });

        res.status(200).json({
            message: "Data berhasil disimpan seluruhnya",
            data
        });
    } catch (error) {
        next(error)
    }

};

// PATH: METHOD DELETE UNTUK MENGHAPUS DATA EXPERIENCE SESUAI ID
const remove = async (req, res, next) => {
    try {
        let id = req.params.id;

        id = Validate(isID, id);

        const currentExperience = await Prisma.experience.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!currentExperience) throw new ResponseError(404, `Blog dengan ${id} tidak ditemukan`);

        // EKSEKUSI DELETE
        await Prisma.experience.delete({
            where: { id }
        });

        res.status(200).json({
            message: "Data berhasil dihapus",
            id
        });
    } catch (error) {
        next(error)
    }

};

export default {
    getAll,
    get,
    post,
    put,
    remove,
    getExperience
}