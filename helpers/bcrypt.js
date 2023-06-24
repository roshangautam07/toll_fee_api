import bcrypt from 'bcryptjs';
export function hash(password) {
    // const salt =  bcrypt.genSalt(10);
    return bcrypt.hashSync(password, 10);
}

export async function generatehash(text, size) {
    try {
        const salt = await bcrypt.genSalt(size);

        const hash = await bcrypt.hash(text, salt);

        return hash;
    } catch (error) {
        console.log(error);
    }
}
export async function compare(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}