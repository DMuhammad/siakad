const { inquirer, chalk } = require('./src/index.js');

const questionTools = [
    "- Menampilkan Informasi Seputar KRS",
    "- Menampilkan Pemasaran Jadwal Kuliah",
    "- Menampilkan Transkrip Nilai",
    "- Keluar",
];

const menuQuestion = {
    type: "list",
    name: "choice",
    message: "> Select tools :",
    choices: questionTools,
};

const question = async() => {
    try {
        const { choice } = await inquirer.prompt(menuQuestion);
        choice == questionTools[0] && require("./src/krs.js")
        choice == questionTools[1] && require("./src/pemasaranJadwal.js")
        choice == questionTools[2] && require("./src/transkripNilai.js")
        choice == questionTools[3] && process.exit()
    } catch (error) {
        console.log(error)
    }
}

(async() => {
    console.log(chalk`{bold.green
        
    ███████╗██╗ █████╗ ██╗  ██╗ █████╗ ██████╗      ██╗███████╗
    ██╔════╝██║██╔══██╗██║ ██╔╝██╔══██╗██╔══██╗     ██║██╔════╝
    ███████╗██║███████║█████╔╝ ███████║██║  ██║     ██║███████╗
    ╚════██║██║██╔══██║██╔═██╗ ██╔══██║██║  ██║██   ██║╚════██║
    ███████║██║██║  ██║██║  ██╗██║  ██║██████╔╝╚█████╔╝███████║
    ╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚════╝ ╚══════╝
                                 
    - https://instagram.com/dzikrimuhammad__
    
    }`)
    question()
})();