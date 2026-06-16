
import bcrypt from 'bcrypt';
import { pool } from "../db/connect.js";

export const createAdmin = async (its, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let sql = "update person set password = ? where its = ? ";
    await pool.query(sql, [hashedPassword, its]);
    if (its == 60433342) {
        sql = "select its,name,zone from person where its = ?";
    }
    else {
        sql = "select its,name,zone,team.teamId from person inner join team on person.its = team.teamLeadITS where team.teamLeadITS = ?";
    }
    const admin = await pool.query(sql, [its]);
    return admin[0][0];
};

export const findAdminUser = async (its) => {
    let sql = ""
    if (its == 60433342) {
        sql = "select its,password,name,zone from person  where its = ?";
    }
    else {
        sql = "select its,password,name,zone,team.teamId from person inner join team on person.its = team.teamLeadITS where team.teamLeadITS = ?";
    }

    const admin = await pool.query(sql, [its]);
    return admin[0][0];
}