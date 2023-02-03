const { puppeteer, cheerio, fs, workBook } = require('./index.js');
require('dotenv').config();

const login = async (page) => {
    await page.type(".logininput:nth-child(1)", process.env.NIM)
    
    await page.type(".logininput:nth-child(3)", process.env.PASSWORD)
}

const transkripnilai = async (page) => {
    await page.goto(process.env.TRANSKRIP_URL)
    
    console.log("Membuka Website Transkrip Nilai")
    const data = await page.evaluate(() => 
        document.documentElement.innerHTML
    )
    
    const $ = cheerio.load(data);
    console.log("Mengambil data");
    
    await new Promise(r => setTimeout(r, 5000))
    const scrapedMatkul = []
    $("#nav-transkrip > .table-responsive > .dataTables_wrapper > table > tbody > tr").each((index, element) => {
        const no = $(element).find('td:nth-child(1)').text()
        const kode = $(element).find('td:nth-child(2)').text()
        const matakuliah = $(element).find('td:nth-child(3)').text()
        const sks = $(element).find('td:nth-child(4)').text()
        const nilaiangka = $(element).find('td:nth-child(5)').text()
        const nilaihuruf = $(element).find('td:nth-child(6)').text()
        const sksxangka = $(element).find('td:nth-child(7)').text()
        
        scrapedMatkul.push({
            no: no.trim(),
            kode: kode.trim(),
            matakuliah: matakuliah.trim(),
            sks: sks.trim(),
            nilaiangka: nilaiangka.trim(),
            nilaihuruf: nilaihuruf.trim(),
            sksxangka: sksxangka.trim(),
        })
    });

    const workSheet = workBook.addWorksheet("Transkrip Nilai")
    workSheet.columns = [
        {header: "No", key: "no", width: 10},
        {header: "Kode Matakuliah", key: "kode", width: 30},
        {header: "Nama Matakuliah", key: "matakuliah", width: 50},
        {header: "SKS", key: "sks", width: 10},
        {header: "Nilai Angka", key: "nilaiangka", width: 15},
        {header: "Nilai Huruf", key: "nilaihuruf", width: 15},
        {header: "SKS x Nilai Angka", key: "sksxangka", width: 20},
    ]

    scrapedMatkul.forEach(matkul => {
        workSheet.addRow(matkul);
    })

    try {
        await workBook.xlsx.writeFile("transkrip.xlsx")
        .then(() => {
            console.log("Berhasil menyimpan riwayat transkrip nilai")
        })
    } catch (error) {
        console.log(error)
    }
    
    // console.log(scrapedMatkul)
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
    
    transkripnilai(page)

    await new Promise(r => setTimeout(r, 10000))
    await browser.close();
})();