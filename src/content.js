extensionData = null

async function setUpdatedExtensionData() {
    const result = await chrome.storage.local.get("BetterVKSupportData")
    
    extensionData = result.BetterVKSupportData

    if (extensionData.versionNumber != 3) {
        alert(`Для нормальной работы расширения BetterVKSupport обновите расширение! Актуальная версия: ${extensionData.currentVersion}, в то время как ваша версия - 1.2`)
    }
}

async function cyberbulling(){
    if (extensionData === null) await setUpdatedExtensionData()
    if (!window.location.href.includes("act=")) return await cyberbulling2();
    if (window.location.href.includes("?act=new")) return newQuestion();
    if (!window.location.href.includes("?act=show")) return;

    logExtensionInfo()

    const agentAvatars = getAgentAvatars()

    const agentNicknames = getAgentNicknames()
    
    const ticketDOMs = document.getElementsByClassName("tickets_image__i")
    const buttonsDOM = document.getElementsByClassName("tickets_envelope_controls")[0].children[1]

    const isAdblockerDetected = await checkForAdblocker()

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
            const clonedAnswer = agentRateFunction.cloneNode(true)
            const divider = document.createElement('span')

            divider.classList.add("divider")

            clonedAnswer.textContent = "да вы ахуели чтоли"

            clonedAnswer.setAttribute("onclick", `const textarea = document.getElementById("tickets_reply")
            
            if(!textarea.value.includes("да вы ахуели чтоли")) {
                textarea.value += "да вы ахуели чтоли"
            } else {
                alert("Я думаю они там реально ахуели чтоли")
            }
            
            return;`)

            document.getElementsByClassName("tickets_reply_actions__list")[childrenIndex].children[0].appendChild(divider)
            document.getElementsByClassName("tickets_reply_actions__list")[childrenIndex].children[0].appendChild(clonedAnswer)

            agentRateFunction = parseFunction(agentRateFunction.outerHTML)
            rateAnswers.push([agentRateFunction.split("Tickets.rateComment(")[1].replace(")", "").split(",")])
        }

        children.src = isAdblockerDetected ? extensionData.reserveAvatars[agentId % extensionData.reserveAvatars.length] : extensionData.baseDatabaseUri + agentAvatars[agentId % agentAvatars.length]
        children.parentElement.parentElement.children[1].children[0].children[0].textContent = agentNicknames[agentId % agentNicknames.length]
    }

    if (rateAnswers.length != 0) {
        const clonedButton = buttonsDOM.cloneNode(true)

        clonedButton.textContent = "Агент Поддержки, иди нахуй!"

        clonedButton.setAttribute("onclick", `let answers = [ ${rateAnswers.map(e => '[' + e + ']').join(", ")} ]

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

async function cyberbulling2(){
    const agentAvatars = getAgentAvatars()

    const agentNicknames = getAgentNicknames()

    const isAdblockerDetected = await checkForAdblocker()

    const questions = document.getElementsByClassName("tu_last")

    logExtensionInfo()

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

        question.children[0].children[0].src = isAdblockerDetected ? getRandomElement(extensionData.reserveAvatars) : extensionData.baseDatabaseUri + getRandomElement(agentAvatars)
        question.children[1].textContent = getRandomElement(agentNicknames)
    }

    const ticketsList = document.getElementsByClassName("tickets_list")

    if (ticketsList.length != 0) {
        const observer = new MutationObserver(function(mutations) {
            cyberbulling2();
        });

        const config = { attributes: true, childList: true, characterData: true }

        observer.observe(ticketsList, config);
    }
}

async function checkForAdblocker() {
    try{
        await fetch("https://raw.githubusercontent.com/tailsjs/BetterVKSupport/images/1.jpg")
    } catch(e) {
        return true
    }

    return false
}

function newQuestion() {
    const ticketsTitle = document.getElementById("tickets_title")
    const ticketsText = document.getElementById("tickets_text")
    const ticketsTitleLabel = document.getElementsByClassName("tickets_title_label")[0]
    

    ticketsTitle.placeholder = "Опишите вашу проблему так, чтобы мы точно всё поняли."
    ticketsText.placeholder = "Че бы вы тут не нахуярили, мы сделаем вид, что мы всё поняли. Возможно мы вам поможем."
    ticketsTitleLabel.textContent = "Удачи)0))"
}

cyberbulling()

function parseFunction(element) {
    return (element.split("return")[1].split("')")[0] + "')").trim()
}

function getLastElement(array) {
    return array[array.length - 1]
}

function logExtensionInfo() {
    console.log("BetterVKSupport v1.2 by tailsjs")
}

function getAgentAvatars() {
    return extensionData.avatars
}

function getAgentNicknames() {
    return extensionData.nicknames
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}