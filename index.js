const fs = require("fs");
const Crypto = require("crypto");
const Axios = require("Axios");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const csv = require('csv-parser');
const Language = require("./jsonHp.language.json");

const translationInformation = () => {
	const noTrad = Language.filter((line) => {
		return line.id === line.en;
	})

	const keyList = noTrad.map((line) => {
		return line.id;
	})

	return [noTrad.length, keyList, Language.length]
}

const generateFullExport = (translation, name) => {
	const languageUpdated = Language.filter((elt) => elt.en !== elt.id);
	let toTranslate = `"id", "desc", "zh", "en"`;
	languageUpdated.forEach((elt) => {
		toTranslate = `${toTranslate}\n"${elt.id}", "${elt.desc}", "${elt.zh}", "${elt.en}"`;
	});
	fs.writeFileSync(`output/${name}.csv`, toTranslate);
}

const generateNoTranslationFile = (keyList, translation, name) => {
	let toTranslate = `"id", "desc", "zh", "en"`;
	keyList.forEach((key) => {
		const elt = translation[translation.findIndex((elt) => elt.id === key)];
		toTranslate = `${toTranslate}\n"${key}", "${elt.desc}", "${elt.zh}", ""`;
	});
	fs.writeFileSync(`output/${name}.csv`, toTranslate);
}

const generateJsonHpFile = (data, prefix = null) => {
	fs.writeFileSync(`output/jsonHp.language${prefix ? "-"+prefix : ""}.json`,JSON.stringify(data, null, 2));
}

const getUpdatedLanguage = async () => {
	const res = await Axios.get("https://app.condragon.com/res/json/language.json");
	return res.data;
}

const readOneSkyFile = async (filename) => {
	return new Promise(function(resolve, reject){
		const results = [];
		fs.createReadStream(filename)
		 .pipe(csv())
		 .on('data', (data) => results.push(data))
		 .on("error", reject)
		 .on('end', () => {
			return resolve(results);
		});
	});
}

const createHashFromFile = (filePath) => new Promise(resolve => {
  const hash = Crypto.createHash('sha256');
  fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(hash.digest('hex')));
});

const argv = yargs(hideBin(process.argv))
	.command("checksum", 'generate jsonHP.language file checksum', (yargs) => {

	}, async (argv) => {
		const checksum = await createHashFromFile("public/jsonHp.language.json");
		fs.writeFileSync("public/version.json", JSON.stringify({checksum: checksum, timestamp: `${+(new Date())}`}, null, 2));
	})
	.command("count", 'display information about the trade', (yargs) => {

	}, async (argv) => {
		console.log("Display translation informations");
		const [notranslation, keyList, total] = translationInformation();
		console.log("Total: ", total, "\nNo translation: ", notranslation);
		generateNoTranslationFile(keyList, Language, "totranslate");
	})
	.command("onesky", 'full export to onesky', (yargs) => {

	}, async (argv) => {
		generateFullExport(Language, "onesky-full");
	})
	.command("update", "update the translation file from ConDragon Api", (yargs) => {

	}, async (argv) => {
		const languageUpdated = new Array(...Language);
		const zhUpdatedLanguage = await getUpdatedLanguage();
		if(zhUpdatedLanguage.length === languageUpdated.length){
			console.log("No new Translation. TODO -> Check if a key has been rename or else");
		}else{
			const insertedKey = [];
			zhUpdatedLanguage.forEach((zhElement) => {
				const eltIndex = languageUpdated.findIndex((elt) => elt.id === zhElement.id);
				if(eltIndex !== -1){
					languageUpdated[eltIndex] = {...languageUpdated[eltIndex], zh: zhElement.zh, size_zh: zhElement.size_zh.zh, desc: zhElement.desc};
				}else{
					languageUpdated.push(zhElement);
					insertedKey.push(zhElement.id);
				}
			});

			console.log("Updated Translation");
			console.log("Total: ", languageUpdated.length);
			console.log("Inserted Element: ", insertedKey.length);
			if(insertedKey.length > 0){
				generateNoTranslationFile(insertedKey, languageUpdated, `totranslate-${+(new Date())}`);
				generateJsonHpFile(languageUpdated, `${+(new Date())}`);
			}
		}
	})
	.command("import [filename]", "import from OS", (yargs) => {
		return yargs.positional('filename', {
    		describe: "filename to import",
    		default: "onesky-export.csv"
	    })
	}, async (argv) => {
		const OSData = await readOneSkyFile(argv.filename);
		const languageUpdated = new Array(...Language); 
		console.log("Updating translation .... ");
		OSData.forEach((line) => {
			const eltIndex = languageUpdated.findIndex((elt) => elt.id === line['String Identifier']);
			if(languageUpdated[eltIndex].en != line.English){
				console.log("\t", line['String Identifier'], "||", languageUpdated[eltIndex].en, "--->", line.English)
				languageUpdated[eltIndex] = {...languageUpdated[eltIndex], en: line.English};
			}
		});
		console.log("End")
		generateJsonHpFile(languageUpdated, `${+(new Date())}`);
	})
	.argv;