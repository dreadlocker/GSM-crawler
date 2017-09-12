"use strict";

var id = 0;

function idGen() {
    return id += 1;
};

const urlBase = 'http://www.gsmarena.com/',
    urlPage1 = 'http://www.gsmarena.com/samsung-phones-f-9-0-p2.php';

require('isomorphic-fetch');
fetch(urlPage1)
    .then((response) => {
        return response.text();
    })
    .then((html) => {
        require('./dom-parser')(html)

        const achorsArray = $('.makers ul li a').toArray(),
            linksArray = [];

        achorsArray.forEach((el) => {
            linksArray.push(urlBase + el.href);
        })

        return Promise.resolve(linksArray);
    })
    .then((linksArray) => {
        function asyncFunction(item) {
            return fetch(item)
                .then((responce) => {
                    return responce.text();
                })
                .then((html) => {
                    require('./dom-parser')(html);
                    let image = $('.center-stage div a img')[0].src,
                        name = $('.article-info div h1').html(),
                        // released = $('.specs-brief-accent span').eq(0).text(),
                        size = $('.center-stage ul li span.specs-brief-accent span').eq(1).text(),
                        os = $('.center-stage ul li span.specs-brief-accent span').eq(2).text(),
                        storage = $('.center-stage ul li span.specs-brief-accent span').eq(3).text(),
                        displaySize = $('ul.specs-spotlight-features li.help-display strong').eq(0).text(),
                        // displayPixels = $('ul.specs-spotlight-features li.help-display div').eq(0).text(),
                        cameraSize = $('.help-camera strong').eq(0).text().slice(0, ($('.help-camera strong').eq(0).text().indexOf('MP') + 2)),
                        // cameraPixels = $('ul.specs-spotlight-features li.help-camera div').eq(0).text(),
                        RAM = $('ul.specs-spotlight-features li.help-expansion strong').eq(0).text(),
                        chipset = $('ul.specs-spotlight-features li.help-expansion div').eq(0).text(),
                        batteryMaH = $('ul.specs-spotlight-features li.help-battery strong').eq(0).text(),
                        // batteryType = $('ul.specs-spotlight-features li.help-battery div').eq(0).text(),
                        priceArr = $('td.nfo'),
                        lastOfpriceArr = priceArr.length - 1,
                        price = priceArr[lastOfpriceArr].innerHTML,
                        id = 0;

                    if (cameraSize === 'N') {
                        cameraSize = 'NO'
                    }

                    let priceString = price.indexOf('About')
                    if (priceString === -1) {
                        price = 'About 300 EUR';
                    }

                    let obj = {
                        image: image,
                        name: name,
                        size: size,
                        os: os,
                        storage: storage,
                        displaySize: displaySize,
                        cameraSize: cameraSize,
                        RAM: RAM,
                        chipset: chipset,
                        batteryMaH: batteryMaH,
                        price: price,
                        id: idGen()
                    };

                    console.log(`{image:'${obj.image}',
name:'${obj.name}',size:'${obj.size}',
os:'${obj.os}',
storage:'${obj.storage}',
displaySize:'${obj.displaySize}',
cameraSize:'${obj.cameraSize}',
Memory:'${obj.RAM}',
chipset:'${obj.chipset}',
batteryMaH:'${obj.batteryMaH}',
price:'${obj.price}',
id: ${obj.id}},`);
                })
        }

        let requests = linksArray.map((item) => {
            return Promise.resolve(asyncFunction(item));
        });

        // Promise.all(requests)
        //     .then((res) => { console.log(asd); });
    });