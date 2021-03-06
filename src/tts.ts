import { kanaToRomajiMap, kanjiToKanaMap, katakanaToHiragana } from "./japanese-tools";
import { urlRegex } from "./utils";

const synth = new Animalese('animalese.wav', function () {  });

function speakAnimalese(text: string, pitch: number, volume: number)
{
    // replace every japanese character with a random roman letter
    // text = text
    //     .split("")
    //     .map(c => isJapaneseCharacter(c) 
    //               ? ["a", "e", "i", "o", "u"][Math.floor(Math.random() * 5)]
    //               : c)
    //     .join("")

    // attempt to translate each japanese character to romaji
    text = katakanaToHiragana(text)
        .split("")
        .map(c =>
        {
            const kanaizedKanji = kanjiToKanaMap[c]
            if (kanaizedKanji)
                return katakanaToHiragana(kanaizedKanji).split("").map(x => kanaToRomajiMap[x]).join("")

            return kanaToRomajiMap[c] || c
        })

        .join("")

    // scale pitch so that it's within the range 0.2 - 2.0
    if (pitch === null || pitch === undefined)
        pitch = 1
    else
        pitch = (pitch / 2) * 1.3 + 0.7
    var audio = new Audio();
    audio.src = synth.Animalese(text, false, pitch).dataURI;
    audio.volume = volume / 100

    console.log(pitch)

    audio.play();
}

function isJapaneseCharacter(character)
{
    const charCode = character.charCodeAt(0)
    // CJK Unified Ideographs 
    if (charCode >= 0x4E00 && charCode <= 0x9FFF)
        return true
    // hiragana + katakana
    if (charCode >= 0x3040 && charCode <= 0x30FF)
        return true
}

function isJapanese(text)
{
    // very simple heuristic, we just assume that if a sentence has at least one japanese character, then it must be japanese
    for (let i = 0; i < text.length; i++)
        if (isJapaneseCharacter(text.charAt(i))) return true

    return false
}

export function speak(message: string, voiceURI: string, volume: number, pitch: number = 1)
{
    if (volume == 0)
        return

    const cleanMsgForSpeech = message
        .replace(urlRegex, "URL")
        .replace(/ww+/gi, "????????????")
        .replace(/??????+/gi, "????????????")
        .replace(/88+/gi, "????????????")

    if (voiceURI == "animalese")
    {
        speakAnimalese(cleanMsgForSpeech, pitch, volume)
        return
    }

    const allVoices = speechSynthesis.getVoices()

    if (allVoices.length == 0)
        return

    const utterance = new SpeechSynthesisUtterance(cleanMsgForSpeech)

    utterance.volume = volume / 100
    utterance.pitch = pitch // range between 0 (lowest) and 2 (highest), with 1 being the default pitch 

    if (voiceURI == "automatic")
    {
        utterance.lang = isJapanese(message) ? "ja" : "en"
    }
    else
    {
        const voice = allVoices.find(v => v.voiceURI == voiceURI)
        if (voice) utterance.voice = voice
    }

    speechSynthesis.speak(utterance)
}

// Horrible workaround for this chrome bug https://bugs.chromium.org/p/chromium/issues/detail?id=679437
// Basically TTS will hang when playing an utterance longer than 15 seconds, and when that happens it will
// remain stuck until speechSynthesis.cancel() is called. As a workaround, I pause and resume TTS every 14 seconds.
// if (navigator.userAgent.match(/Chrome/) && !navigator.userAgent.match(/Edg/))
// {
//     console.log("Applying chrome TTS bug workaround")

//     setInterval(() => {
//         if (speechSynthesis.speaking)
//         {
//             console.log("Restarting TTS")
//             speechSynthesis.pause()
//             setTimeout(() => speechSynthesis.resume(), 0)
//         }
//     }, 14 * 1000)
// }
