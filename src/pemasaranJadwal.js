const { puppeteer, cheerio,readlineSync, workBook } = require('./index.js')
require('dotenv').config();

let isFilter, angkatan, hari;

const login = async (page) => {
    await page.type(".logininput:nth-child(1)", process.env.NIM)
    
    await page.type(".logininput:nth-child(3)", process.env.PASSWORD)
}

const pemasaranJadwal = async (page) => {
    await page.goto(process.env.PENJADWALAN_URL)
    
    console.log("Membuka Website Pemasaran dan Jadwal Kuliah")
    const data = await page.evaluate(() => 
        document.documentElement.innerHTML
    )
    
    await new Promise(r => setTimeout(r, 1000))
    console.log("Membuka Tab Jadwal Seluruh Kuliah")
    await page.click("#nav-tab > #nav-matakuliah-tab")

    const $ = cheerio.load(data);
    console.log("Mengambil data");

    await new Promise(r => setTimeout(r, 5000))
    const scrapedMatkul = []
    $("#nav-matakuliah > .table-responsive > .dataTables_wrapper > table > tbody > tr").each((index, element) => {
        const no = $(element).find('td:nth-child(1)').text()
        const hari = $(element).find('td:nth-child(2)').text()
        const pukul = $(element).find('td:nth-child(3)').text()
        const kode = $(element).find('td:nth-child(4)').text()
        const matakuliah = $(element).find('td:nth-child(5)').text()
        const dosen = $(element).find('td:nth-child(6)').text()
        const asistendosen = $(element).find('td:nth-child(7)').text()
        const ruang = $(element).find('td:nth-child(8)').text()
        const kelas = $(element).find('td:nth-child(9)').text()
        const tatapmuka = $(element).find('td:nth-child(10)').text()
        const angkatan = $(element).find('td:nth-child(11)').text()
        const kapasitas = $(element).find('td:nth-child(12)').text()

        scrapedMatkul.push({
            no: no.trim(),
            hari: hari.trim(),
            pukul: pukul.trim(),
            kode: kode.trim(),
            matakuliah: matakuliah.trim(),
            dosen: dosen.trim(),
            asistendosen: asistendosen.trim(),
            ruang: ruang.trim(),
            kelas: kelas.trim(),
            tatapmuka: tatapmuka.trim(),
            angkatan: angkatan.trim(),
            kapasitas: kapasitas.trim(),
        })
    });
    
    // console.log(scrapedMatkul)

    // const workBook = new excelJS.Workbook();
    const workSheet = workBook.addWorksheet("Pemasaran Jadwal Kuliah");
    workSheet.columns = [
        {header: "No", key: "no", width: 10},
        {header: "Hari", key: "hari", width: 10},
        {header: "Pukul", key: "pukul", width: 20},
        {header: "Kode", key: "kode", width: 20},
        {header: "Mata Kuliah", key: "matakuliah", width: 40},
        {header: "Dosen", key: "dosen", width: 40},
        {header: "Asisten Dosen", key: "asistendosen", width: 20},
        {header: "Ruang", key: "ruang", width: 10},
        {header: "Kelas", key: "kelas", width: 10},
        {header: "Tatap Muka", key: "tatapmuka", width: 15},
        {header: "Angkatan", key: "angkatan", width: 10},
        {header: "Kapasitas", key: "kapasitas", width: 10},
    ]

    scrapedMatkul.map(matkul => {
        if (isFilter) {
            if(matkul.hari !== hari && matkul.angkatan === angkatan) {
                workSheet.addRow(matkul)
            }
        } else {
            scrapedMatkul.forEach(matkul => {
                workSheet.addRow(matkul);
            })
        }
    })


    try {
        await workBook.xlsx.writeFile("matkul.xlsx")
        .then(() => {
            console.log("Berhasil menyimpan jadwal mata kuliah")
        })
    } catch (error) {
        console.log(error)
    }
}

(async() => {
    isFilter = readlineSync.keyInYN('Do you want to filter data ?')
    if (isFilter) {
        angkatan = readlineSync.question('Data angkatan berapa yang ingin ditampilkan ? (2020 - 2022)   :   ')
        hari = readlineSync.question('Hari apa yang tidak ingin ditampilkan ? Pilih salah satu (Senin - Jumat)  :   ')
    }
    
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
    
    pemasaranJadwal(page)

    await new Promise(r => setTimeout(r, 10000))
    await browser.close();
})();