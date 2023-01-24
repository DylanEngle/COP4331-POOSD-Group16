const contactCardTemplate = document.querySelector("[data-contact-template]")
const contactCardContainer = document.querySelector("[data-contact-cards-container]")
const searchInput = document.querySelector("[data-search]")

let contacts = []

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    console.log(contacts)
    contacts.forEach(contact => {
        const isVisible = 
            contact.name.toLowerCase().includes(value) || 
            contact.email.toLowerCase().includes(value) ||
            contact.number.toLowerCase().includes(value)

        contact.element.classList.toggle("hide", !isVisible)
    })
})

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
        contacts = data.map(contact => {
            const card = contactCardTemplate.content.cloneNode(true).children[0]
            const header = card.querySelector("[data-header]")
            const number = card.querySelector("[data-number]")
            const email = card.querySelector("[data-email]")

            header.textContent = contact.name
            number.textContent = contact.phone
            email.textContent = contact.email
            contactCardContainer.append(card)
            return { name: contact.name, number: contact.phone, 
                    email: contact.email, element: card }
        })
       
    })