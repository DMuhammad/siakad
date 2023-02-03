const { puppeteer, cheerio, fs } = require('./index.js')
require('dotenv').config();

const login = async (page) => {
    await page.type(".logininput:nth-child(1)", process.env.NIM)
    
    await page.type(".logininput:nth-child(3)", process.env.PASSWORD)
}

const krs = async (page) => {
    await page.goto(process.env.KRS_URL)
    
    console.log("Membuka Website KRS")
    const data = await page.evaluate(() => 
    document.documentElement.innerHTML
    )
    
    const $ = cheerio.load(data);
    console.log("Mengambil data");
    
    const scrapedData = [];
    const tableKey = [];
    let num = 0

    await new Promise(r => setTimeout(r, 5000))
    
    $("div.card > table > tbody > tr").each((index, element) => {
        const key = $(element).find('td:nth-child(1)')
        $(key).each((i, e) => {
            tableKey.push(
                $(e).text()
                )
            })
            
            const tds = $(element).find('td:nth-child(2)')
            const tableRow = {}
            $(tds).each((ind, el) => {
            if (num == 0) {
                const name = $(el).find('div.float-left')
                tableRow[tableKey[num]] = $(name).text()
            }else {
                tableRow[tableKey[num]] = $(el).text()
            }
        })
        num++
        scrapedData.push(tableRow)
    });
    
    console.log(scrapedData)
    
    // await new Promise(r => setTimeout(r, 5000))
    // const tableHeader = []
    
    
    // $("table#tbl_krs > thead > tr").each((index, element) => {
    //     const thead = $(element).find('th')
    //     $(thead).each((i, e) => {
    //         tableHeader.push(
    //             $(e).text()
    //         )
    //     })
    // });
    // console.log(tableHeader)
    
    // await new Promise(r => setTimeout(r, 5000))
    // const scrapedMatkul = []
    // $("table#tbl_krs > tbody > tr").each((index, element) => {
    //     const tdata = $(element).find('td')
        
    //     const tableRow = {}
    //     $(tdata).each((i, e) => {
    //         // tableRow[tableHeader[i]] = $(el).text()
    //         scrapedMatkul.push($(e).text())
    //     })
    //     // scrapedMatkul.push(tableRow)
    // });
    
    console.log(scrapedData)

    fs.writeFile("data.txt", JSON.stringify(scrapedData), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
        }
    });
}

(async() => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized'
        ]
    })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()

    await page.goto(process.env.BASE_URL)
    
    await navigationPromise
    
    login(page)
    
    await new Promise(r => setTimeout(r, 5000))
    
    await page.click("button");
    
    krs(page)

    await new Promise(r => setTimeout(r, 10000))
    await browser.close();
})();