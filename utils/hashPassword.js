import bcrypt from 'bcrypt'

const hashPassword = async (password) => {
    try {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash
    } catch (error) {
        console.log('Error hashing password', error)
    }
}

export default hashPassword
