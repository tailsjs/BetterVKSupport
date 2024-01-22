console.log("BetterVKSupport v1.0 by tailsjs!")

function cyberbulling(){
    if (!window.location.href.includes("act=")) return cyberbulling2();
    if (!window.location.href.includes("?act=show")) return;

    const agentAvatars = getAgentAvatars()

    const agentNicknames = getAgentNicknames()
    
    const ticketDOMs = document.getElementsByClassName("tickets_image__i")
    const buttonsDOM = document.getElementsByClassName("tickets_envelope_controls")[0].children[1]

    const rateAnswers = []

    for(let childrenIndex in ticketDOMs) {
        const children = ticketDOMs[childrenIndex]
        if (isNaN(childrenIndex) || children.src.includes("ava=1")) {
            continue
        }

        const agentName = children.parentElement.parentElement.children[1].children[0].textContent
        const agentId = agentName.includes("#") ? Number(agentName.split("#")[1]) : 0

        let agentRateFunction = getLastElement(ticketDOMs[childrenIndex]
            .parentElement
            .parentElement
            .children[1]
            .children)
            .children[1]
            .children[0]
            .children[2]

        if (agentRateFunction) {
            agentRateFunction = parseFunction(agentRateFunction.outerHTML)
            rateAnswers.push([agentRateFunction.split("Tickets.rateComment(")[1].replace(")", "").split(",")])
        }

        children.src = agentAvatars[agentId % agentAvatars.length]
        children.parentElement.parentElement.children[1].children[0].textContent = agentNicknames[agentId % agentNicknames.length]
    }

    if (rateAnswers.length != 0) {
        const clonedButton = buttonsDOM.cloneNode(true)

        clonedButton.textContent = "Агент Поддержки, иди нахуй!"

        clonedButton.setAttribute("onclick", `
        let answers = [ ${rateAnswers.map(e => '[' + e + ']').join(", ")} ]

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function letsfuckingdestroyit(){
            for(let answer of answers) {
                Tickets.rateComment(answer[0], answer[1], answer[2], answer[3])
                await sleep(1000)
            }
        }

        letsfuckingdestroyit()`)


        document.getElementsByClassName("tickets_envelope_controls")[0].appendChild(clonedButton)
    }
}

function cyberbulling2(){
    const agentAvatars = getAgentAvatars()

    const agentNicknames = getAgentNicknames()

    const questions = document.getElementsByClassName("tu_last")

    for(let questionIndex in questions) {
        const question = questions[questionIndex]

        if(typeof question != "object") continue;

        const agentPic = question
                        .children[0]
                        .children[0]
                        .src

        if(agentPic.includes("ava=1")) {
            continue;
        }
        console.log(question.children[0].children[0].src)
        question.children[0].children[0].src = getRandomElement(agentAvatars)
        question.children[1].textContent = getRandomElement(agentNicknames)
    }

    const observer = new MutationObserver(function(mutations) {
        cyberbulling2();
    });

    const config = { attributes: true, childList: true, characterData: true }

    observer.observe(document.getElementById("tickets_list"), config);
}

cyberbulling()

function parseFunction(element) {
    return (element.split("return")[1].split("')")[0] + "')").trim()
}

function getLastElement(array) {
    return array[array.length - 1]
}

function getAgentAvatars() {
    return [
        "https://www.meme-arsenal.com/memes/5a8286009c186bbbb15c211c0dabfdb0.jpg",
        "https://cdn.shazoo.ru/556218_2LwhiuLI6o_388d088326ee1064135a61ae33889a8a.jpg",
        "https://www.meme-arsenal.com/memes/bf32b678fa17571d7945dc4ea1dcdb01.jpg",
        "https://www.meme-arsenal.com/memes/01895223fbd8653cd5affa09871cfb8f.jpg",
        "https://i.playground.ru/p/P8yhpZqQ47nJPI--nPXBBg.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbUHL-Mn6PGOt_Krh-abMX6QvqKd8VOxI3eD5LAnlaAAl6SffUeyr2jarT4fsl3-RBcZM&usqp=CAU" // change later
    ]
}

function getAgentNicknames() {
    return [
        "Сиделый",
        "Петух",
        "Уёбок",
        'Мутный', 
        'Хитрый', 
        'Скользкий', 
        'Проблема', 
        'Геморрой',
        'Хмурый', 
        'Злой', 
        'Угрюмый', 
        'Беда', 
        'Пика', 
        'Волына',
        "Арестант",
        "Бес",
        "Бродяга",
        "Дьявол",
        "Автоматчик",
        "Заключенный"
    ]
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}