const express = require(`express`);
const router = express.Router();
const mysql = require(`../database/executor`);
const load = require(`../database/load`)

router.get(`/loadData`, async (req, res) => {
    try {
        const result = await load.loadData();
        console.log(result)
        return res.json({
            status: true,
            message: result
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            comments: [],
            message: `Something went wrong. Try Later.`
        })
    }
});

router.post(`/search`, async (req, res) => {
    try {
        let search = req.body.searchString;
        if (!search) return res.json({
            status: false,
            products: [],
            message: `Search criteria not specified.`
        })
        let serachQuery = `SELECT * FROM products WHERE`, whereQuery = ``;
        let keywords = search.split(` `);
        let i = 0;
        while (i < keywords.length) {
            if (keywords[i].toLowerCase() == `below`) {
                if (i != 0) whereQuery += ` AND`
                whereQuery += ` price < ${keywords[++i]}`
                i++;
            } else if (keywords[i].toLowerCase() == `above`) {
                if (i != 0) whereQuery += ` AND`
                whereQuery += ` price > ${keywords[++i]}`
                i++;
            } else {
                if (keywords[i].toLowerCase() == 'and') {
                    whereQuery += ` AND`;
                    i++;
                }
                if (keywords[i].toLowerCase() == 'or') {
                    whereQuery += ` OR`;
                    i++;
                }
                whereQuery += ` title LIKE '%${keywords[i]}%'`;
                i++;
            }
        }
        serachQuery += whereQuery + ` ORDER BY popularity DESC`
        console.log(serachQuery);
        try {
            const result = await mysql.executeQuery([serachQuery]);
            if (result && result.length) {
                return res.json({
                    status: true,
                    products: result[0]
                })
            } else {
                return res.json({
                    status: false,
                    products: [],
                    message: `Something went wrong. Try Later.`
                })
            }
        } catch (err) {
            console.log(err)
            return res.json({
                status: false,
                products: [],
                message: `Invalid Search criteria.`
            })
        }
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            products: [],
            message: `Something went wrong. Try Later.`
        })
    }
});

router.get(`/products`, async (req, res) => {
    try {
        let serachQuery = `SELECT * FROM products ORDER BY popularity DESC`;
        const result = await mysql.executeQuery([serachQuery]);
        if (result && result.length) {
            return res.json({
                status: true,
                products: result[0]
            })
        }
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            products: [],
            message: `Something went wrong. Try Later.`
        })
    }
});

module.exports = router;