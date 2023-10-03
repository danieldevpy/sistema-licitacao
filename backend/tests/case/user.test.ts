import { expect, test } from "bun:test";
import { CreateUser, CheckAuth } from "../../app/src/application/usecase/userCase";
import Sqlite from "../../app/internal/sqlite/sqlite";
import SqliteUser from "../../app/internal/sqlite/userSqlite";


Sqlite.getInstance(":memory:")

const userRepository = new SqliteUser();
const username = "daniel"
const pass = "123456";

test("Create User", async ()=>{
    const userID = await CreateUser(userRepository, username, "Daniel Fernandes", pass, 1);
    expect(userID).toEqual(1);
})

test("Login User", async ()=>{
    const response = await CheckAuth(userRepository, username, pass);
    expect(response?.id).toEqual(1);
})