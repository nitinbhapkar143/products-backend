`use strict`;

const fs = require(`fs`);
const mysql = require(`./executor`);

module.exports.loadData = () => {
    return new Promise(async (resolve, reject) => {
        const create = `CREATE TABLE IF NOT EXISTS products ( id INT(11) NOT NULL AUTO_INCREMENT , title VARCHAR(255) NOT NULL , subcategory VARCHAR(50) NOT NULL , price DECIMAL NOT NULL , popularity INT(11) NOT NULL , PRIMARY KEY (id)) ENGINE = InnoDB`
        const checkData = `SELECT COUNT(id) as row_count FROM products`;
        const result = await mysql.executeQuery([create, checkData]);
        if (result && result.length > 1 && result[1].length && result[1][0].row_count > 1) {
            resolve("Data already loaded.")
            return;
        }
        fs.readFile(`./config/assignment.json`, async (err, data) => {
            if (err) {
                console.log(`Failed to load JSON file.`)
                reject(err);
                return;
            }
            let insert = `INSERT INTO products(title, subcategory, price, popularity) VALUES `
            data = JSON.parse(data);
            for (let product of Object.keys(data.products)) {
                insert += `('${data.products[product].title}','${data.products[product].subcategory}','${data.products[product].price}','${data.products[product].popularity}'),`
            }
            console.log(insert)
            insert = insert.substring(0, insert.length - 1);
            const result = await mysql.executeQuery([insert]);
            resolve("Data loaded successfully.")
        });
    })

}

