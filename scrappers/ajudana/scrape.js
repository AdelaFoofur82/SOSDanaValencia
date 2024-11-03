const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeOffers() {
    // Inicia Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navega a la página
        await page.goto('https://ajudadana.es/casos-activos', {
            waitUntil: 'networkidle2', // Espera a que la mayoría de las solicitudes de red se completen
        });

        // Espera a que las ofertas se carguen en la página
        await page.waitForSelector('.bg-white.p-4.rounded-lg.shadow-lg');

        // Extrae los datos de cada oferta
        const offers = await page.evaluate(() => {
            const offerElements = document.querySelectorAll('.bg-white.p-4.rounded-lg.shadow-lg');
            const extractedOffers = [];

            offerElements.forEach(el => {
                const title = el.querySelector('h3')?.textContent.trim() || "N/A";
                const status = el.querySelector('.bg-green-100')?.textContent.trim() || "N/A";
                const description = el.querySelector('.text-gray-700')?.textContent.trim() || "N/A";

                const locationElement = Array.from(el.querySelectorAll('span')).find(span => span.textContent.includes("Ubicación:"));
                const location = locationElement?.nextSibling?.textContent.trim() || "N/A";

                const dateElement = Array.from(el.querySelectorAll('span')).find(span => span.textContent.includes("Fecha:"));
                const date = dateElement?.nextSibling?.textContent.trim() || "N/A";

                const contactElement = Array.from(el.querySelectorAll('span')).find(span => span.textContent.includes("Contacto:"));
                const contact = contactElement?.nextSibling?.textContent.trim() || "N/A";

                const urgencyElement = Array.from(el.querySelectorAll('span')).find(span => span.textContent.includes("Urgencia:"));
                const urgency = urgencyElement?.nextSibling?.textContent.trim() || "N/A";

                const affectedPeopleElement = Array.from(el.querySelectorAll('span')).find(span => span.textContent.includes("Personas afectadas:"));
                const affectedPeople = affectedPeopleElement?.nextSibling?.textContent.trim() || "N/A";

                extractedOffers.push({
                    title,
                    status,
                    description,
                    location,
                    date,
                    contact,
                    urgency,
                    affectedPeople
                });
            });

            return extractedOffers;
        });

        return offers;
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        return [];
    } finally {
        await browser.close(); // Cierra el navegador
    }
}

scrapeOffers();

const offers = scrapeOffers();
// save offers
fs.writeFileSync(__dirname + '/data/ajudadana.json', JSON.stringify(offers, null, 2));
