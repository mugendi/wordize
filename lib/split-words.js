const S = require('string');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

var consonant_blends = {};
var lang_dir = path.join(__dirname ,'..','lang');


function hasRepeats(str) {
    return /([a-zA-Z]).*?\1/.test(str);
}


function blends(w) {
    var blends = w.toLowerCase().match(/[bcdfghjklmnpqrtvwxz]{2}/ig) || [];

    return _.difference((w.toLowerCase().match(/[bcdfghjklmnpqrtvwxz]{2,}/ig) || []), consonant_blends).filter(l => !hasRepeats(l));
};

function compounding(w) {
    var blendsArr = blends(w);
    // console.log(blendsArr);
    return blendsArr.length + 1;
}


function humanize(str, lang='en') {

    lang = !_.isString(lang) ? lang : 'en';

    var filePath = path.join(lang_dir,lang+'.json');

    if(!fs.existsSync(filePath)){ throw new Error('Consonants Blend file not found!');  }

    consonant_blends[lang] = consonant_blends[lang] || require(filePath);

    //decode entities & humanize
    str = S(str).stripTags()
                .decodeHTMLEntities()
                .humanize().s
            
    var blendsArr = blends(str);
    let pat = new RegExp('(' + consonant_blends[lang].join('|') + ')');

    blendsArr.forEach(b => {

        // console.log(b);
        if (b.length == 2) {
            str = str.replace(new RegExp(b, 'ig'), b.split('').join(' '));
        }
        else{
            let m = b.match(pat);
            if (m) {
                let arr = _.chunk(b.split(''), 2).map(a => a.join(''));
                str = str.replace(new RegExp(b, 'ig'), arr.join(' '));
            }
        }

    });


    return str;
}

function words(str, lang='en') {
    str = humanize(str, lang);

    return _.words(str);
}



module.exports = {
    // blends,
    // compounding,
    humanize,
    words
}